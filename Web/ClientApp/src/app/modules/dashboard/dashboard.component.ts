// Angular
import {
	Component, OnInit, ChangeDetectionStrategy,
	ViewChild,
	TemplateRef
} from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from './../../core/_base/layout';
import { Widget4Data } from './../../layout/partials/content/widgets/widget4/widget4.component';
import {
	startOfDay,
	endOfDay,
	subDays,
	addDays,
	endOfMonth,
	isSameDay,
	isSameMonth,
	addHours
} from 'date-fns';
import {
	CalendarEvent,
	CalendarEventAction,
	CalendarEventTimesChangedEvent,
	CalendarView,
	CalendarDateFormatter
} from 'angular-calendar';
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';


import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import {
	Appointment, AppointmentsPageRequested,
	selectQueryResultAppointment, ParticipantsPageRequested, currentUser
} from './../../core/auth';
import { LayoutUtilsService, MessageType } from './../../core/_base/crud';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../core/reducers';
import { QueryParamsModel } from './../../core/_base/crud';
import * as moment from 'moment';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { EventsComponent } from './events/events.component';

const colors: any = {
	red: {
		primary: '#ad2121',
		secondary: '#FAE3E3'
	},
	blue: {
		primary: '#1e90ff',
		secondary: '#D1E8FF'
	},
	yellow: {
		primary: '#e3bc08',
		secondary: '#FDF1BA'
	}
};

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
	providers: [
		{
			provide: CalendarDateFormatter,
			useClass: CustomDateFormatter
		}
	]
})
export class DashboardComponent implements OnInit {
	chartOptions1: SparklineChartOptions;
	chartOptions2: SparklineChartOptions;
	chartOptions3: SparklineChartOptions;
	chartOptions4: SparklineChartOptions;
	widget4_1: Widget4Data;
	widget4_2: Widget4Data;
	widget4_3: Widget4Data;
	widget4_4: Widget4Data;

	@ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
	@ViewChild('pickerStart', { static: true }) datePickerStart: MatDatepicker<Date>;
	@ViewChild('pickerEnd', { static: true }) datePickerEnd: MatDatepicker<Date>;

	view: CalendarView = CalendarView.Week;
	CalendarView = CalendarView;
	viewDate: Date = new Date();
	loggedInUser;
	modalData: {
		action: string;
		event;
	};

	events: [] = [];
	bookedAppointments: any;
	eventObj: Object;
	refresh: Subject<any> = new Subject();
	activeDayIsOpen: boolean = false;
	_updateMessage: string;

	constructor(
		private layoutConfigService: LayoutConfigService,
		private modal: NgbModal, private dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		this.goToHome();
	}

	goToHome() {
		this.store.pipe(
			select(currentUser)
		).subscribe((response) => {
			this.loggedInUser = response;

			switch (response.role) {
				case 'Owner':
				case 'Manager':
						this.router.navigate(['../' + 'provider-dashboard']);
					break;

					case 'User':
						this.router.navigate(['../' + 'therapist-dashboard']);
					break;

				case 'Client':
						this.router.navigateByUrl('../' + 'dashboard');
					break;
				default:
					this.router.navigateByUrl('error/403');
					break;
			}
		});
	}

	ngOnInit(): void {
		this.chartOptions1 = {
			data: [10, 14, 18, 11, 9, 12, 14, 17, 18, 14],
			color: this.layoutConfigService.getConfig('colors.state.brand'),
			border: 3
		};
		this.chartOptions2 = {
			data: [11, 12, 18, 13, 11, 12, 15, 13, 19, 15],
			color: this.layoutConfigService.getConfig('colors.state.danger'),
			border: 3
		};
		this.chartOptions3 = {
			data: [12, 12, 18, 11, 15, 12, 13, 16, 11, 18],
			color: this.layoutConfigService.getConfig('colors.state.success'),
			border: 3
		};
		this.chartOptions4 = {
			data: [11, 9, 13, 18, 13, 15, 14, 13, 18, 15],
			color: this.layoutConfigService.getConfig('colors.state.primary'),
			border: 3
		};
		this.loadAppointments();
	}

	loadAppointments() {
		let queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new AppointmentsPageRequested({ page: queryParams,appointmentParams: ""}));
		this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
			if (res.total == 0) {
				return;
			}
			this.bookedAppointments = res;
			if (this.bookedAppointments && this.bookedAppointments.items) {
				this.events = this.bookedAppointments.items.map(appointmentlist => {
					let starthour = ((appointmentlist.starttime).split(":"))[0];
					let startmin = ((appointmentlist.starttime).split(":"))[1];
					let endhour = ((appointmentlist.endtime).split(":"))[0];
					let endmin = ((appointmentlist.endtime).split(":"))[1];
					const formattedStarttime = (moment(appointmentlist.date)).set({ hour: parseInt(starthour, 10), minute: parseInt(startmin, 10) }).toDate();
					const formattedEndtime = (moment(appointmentlist.date)).set({ hour: parseInt(endhour, 10), minute: parseInt(endmin, 10) }).toDate();
					return {
						start: formattedStarttime,
						end: formattedEndtime,
						colors: colors.red,
						title: appointmentlist.practitioner,
						myActions: appointmentlist
					};
				});
			}
			this.refresh.next();
		});
	}

	/**
	   * Returns object for filter
	   */
	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	setView(view: CalendarView) {
		this.view = view;
	}

	closeOpenMonthViewDay() {
		this.activeDayIsOpen = false;
	}

	// dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
	// 	this.router.navigate(['../participant-appointments/view'], { relativeTo: this.activatedRoute });
	// }

	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
		if (isSameMonth(date, this.viewDate)) {
			if (
				(isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
				events.length === 0
			) {
				this.activeDayIsOpen = false;
			} else {
				this.activeDayIsOpen = true;
			}
			this.viewDate = date;
		}
	}

	handleEvent(action: string, event): void {
		const dialogRefEvenet = this.dialog.open(EventsComponent, {
			width: "600px",
			data: { eventDetails: event.myActions }
		});
		dialogRefEvenet.afterClosed().subscribe(res => {
			if (Object.keys(res).length == 0) {
				return;
			}
			res.isCreatedFromEvent ? this._updateMessage = `Appointment successfully has been created.` : this._updateMessage = `Appointment successfully has been saved.`;
			this.layoutUtilsService.showActionNotification(this._updateMessage, MessageType.Create, 10000, true, true);
			this.loadAppointments();
		});
	}


}
