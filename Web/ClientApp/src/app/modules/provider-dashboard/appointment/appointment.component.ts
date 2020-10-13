// Angular
import { Component, Input, OnInit } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Crud
import { QueryParamsModel, LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { AppointmentsPageRequested, selectQueryResultAppointment, UpcomingAppointmentPageRequested } from './../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { Router, ActivatedRoute } from '@angular/router';
import { isFuture, closestTo } from 'date-fns';
import { EventsComponent } from './events/events.component';
import { MatDialog } from '@angular/material';
import moment from 'moment';
import { EventsDialogComponent } from '../../provider-appointments/events-dialog/events-dialog.component';
import { EventsDialogCheckinComponent } from '../../provider-appointments/events-dialog-checkin/events-dialog-checkin.component';

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

export interface appointmentData {
	title: string;
	desc: string;
	value: string;
	valueClass?: string;
}

@Component({
	selector: 'kt-appointment-therapist',
	templateUrl: './appointment.component.html',
	styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
	// Public properties
	@Input() data: appointmentData[];
	queryParams: any;
	allAppointments: any;
	futureAppointments: any;
	nextAppointmentDate: Date;
	nextAppointment: any;
	hasNextAppointment: boolean = false;
	_updateMessage: string;
	events: [] = [];
	appointmenthasItems = false;
	dialogOpen: any;


	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	constructor(
		private store: Store<AppState>,
		private dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private layoutUtilsService: LayoutUtilsService
	) { }


	/**
	 * On init
	 */
	ngOnInit() {
		this.queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.upcomingAppointment();
	}

	openAppointment(action: string, item): void {
		if(item.appointmentStatus == "Completed"){
			// this.dialogOpen = ProviderEventsComponent;
			this.dialogOpen = EventsDialogComponent;
		  }else{
			this.dialogOpen = EventsDialogCheckinComponent;
			}
			const dialogRefEvenet = this.dialog.open(this.dialogOpen, {
			  width: "650px",
			  data: { eventDetails: item }
			});

		// const dialogRefEvenet = this.dialog.open(EventsComponent, {
		// 	width: '600px',
		// 	data: { eventDetails: participants }
		// });

		// dialogRefEvenet.afterClosed().subscribe(res => {
		// 	if (Object.keys(res).length == 0) {
		// 		return;
		// 	}

		// 	res.isCreatedFromEvent ? this._updateMessage = `Appointment successfully has been created.` : this._updateMessage = `Appointment successfully has been saved.`;
		// 	this.layoutUtilsService.showActionNotification(this._updateMessage, MessageType.Create, 10000, true, true);
		// 	this.upcomingAppointment();
		// });
	}

	// loadAppointments() {
	// 	this.store.dispatch(new UpcomingAppointmentPageRequested({ page: this.queryParams, viewDate: '' }));
	// 	this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
	// 		this.futureAppointments = res.data;
	// 	});
	// }

	upcomingAppointment() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);

		const appointmentParams = {
			results: 10,
		};

		this.store.dispatch(new AppointmentsPageRequested({
			page: queryParams,
			appointmentParams
		}));

		this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
			if (!res) {
				this.appointmenthasItems = false;
				return;
			}
			this.appointmenthasItems = true;
			this.futureAppointments = res.data;
		});
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

}
