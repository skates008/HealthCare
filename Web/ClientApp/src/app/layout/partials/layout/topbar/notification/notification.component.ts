// Angular
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationPageRequested, selectNotificationForTherapist, currentUser, Notification, NotificationOnServerCreated, CareplansPageRequested, TasksPageRequested } from '../../../../../core/auth';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { Router } from '@angular/router';
import { isNgTemplate } from '@angular/compiler';
@Component({
	selector: 'kt-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['notification.component.scss']
})
export class NotificationComponent {

	// Show dot on top of the icon
	@Input() dot: string;

	// Show pulse on icon
	@Input() pulse: boolean;

	@Input() pulseLight: boolean;

	// Set icon class name
	@Input() icon: string = 'flaticon2-bell-alarm-symbol';
	@Input() iconType: '' | 'success';

	// Set true to icon as SVG or false as icon class
	@Input() useSVG: boolean;

	// Set bg image path
	@Input() bgImage: string;

	// Set skin color, default to light
	@Input() skin: 'light' | 'dark' = 'light';

	@Input() type: 'brand' | 'success' = 'success';
	notificationList: any;
	invoiceList: any;
	careplanList: any;
	tasksList: any;
	notificationCount: number = 0;
	loggedInUser: any;
	Link;
	user;
	invoiceLink;
	careplanLink;
	tasksListLink;

	/**
	 * Component constructor
	 *
	 * @param sanitizer: DomSanitizer
	 */
	constructor(private sanitizer: DomSanitizer, private router: Router, private store: Store<AppState>) {
	}
	ngOnInit(): void {
		
		this.store.pipe(
			select(currentUser)
		).subscribe((response) => {
			this.loggedInUser = response;
		});
		
		// this.loadNotifications();
		// this.loadCareplansList();
		// this.loadTasksList();
	}

	backGroundStyle(): string {
		if (!this.bgImage) {
			return 'none';
		}
		return 'url(' + this.bgImage + ')';
	}

	loadCareplansList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration()
		);

		this.store.dispatch(new CareplansPageRequested({ page: queryParams }));
	}

	loadTasksList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration()
		);
		this.store.dispatch(new TasksPageRequested({ page: queryParams }));
	}

	loadNotifications() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new NotificationPageRequested({ page: queryParams }));
		this.store.pipe(
			select(selectNotificationForTherapist)
		).subscribe((response) => {
			this.notificationList = response.data;
			this.careplanList = response.data;
			this.tasksList = response.data;
			if (this.user == "Therapist") {
				this.notificationList = this.notificationList.filter(item => {
					return item.notify == "therapist" && item.type == "appointment";
				})
				this.notificationCount = this.notificationList.length;
				
				this.careplanList = this.careplanList.filter(item => {
					this.careplanLink = 'careplans/careplan-details/';
					return item.notify == "therapist" && item.type == "careplan";
				})
				this.notificationCount =this.notificationList.length + this.careplanList.length;
				this.tasksList = this.tasksList.filter(item => {
					this.tasksListLink = 'tasks/task-details/';
					return item.notify == "therapist" && item.type == "task";
				})
				this.notificationCount = this.notificationList.length + this.careplanList.length + + this.tasksList.length;
			}
			else if (this.user == "participant") {
				this.notificationList = this.notificationList.filter(item => {
					return item.notify == "participant" && item.type == "appointment";
				})
				this.notificationCount = this.notificationList.length;
				
				this.careplanList = this.careplanList.filter(item => {
					this.careplanLink = 'participant-careplan/careplan-details/';
					return item.notify == "participant" && item.type == "careplan";;
				})
				this.notificationCount = this.notificationList.length + this.careplanList.length;
			} 
		});
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	GetnotificationCount() {
		this.notificationCount = 0;
	}

	goToInvoice(invoice) {
		this.router.navigate([this.invoiceLink, invoice.invoiceId]);
	}

	goToTask(task) {
		this.router.navigate([this.tasksListLink, task.taskId]);
	}

	goToCareplan(careplan) {
		this.router.navigate([this.careplanLink, careplan.carePlanId]);
	}

	checkLoggedinUser() {

	}

	goToAppt(appt) {
		this.router.navigate([appt.redirectLink], {
			state: {
				appointmentDate: new Date(appt.appointmentDate)
			}
		}
		)
	}

}
