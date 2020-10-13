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
		this.loadAppointments();
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
		// 	width: "650px",
		// 	data: { eventDetails: participants }
		// });
		// dialogRefEvenet.afterClosed().subscribe(res => {
		// 	if (Object.keys(res).length == 0) {
		// 		return;
		// 	}
		// 	res.isCreatedFromEvent ? this._updateMessage = `Appointment has been created succesfully.` : this._updateMessage = `Appointment successfully has been saved.`;
		// 	this.layoutUtilsService.showActionNotification(this._updateMessage, MessageType.Create, 10000, true, true);
		// 	this.loadAppointments();
		// });
	}

	loadAppointments() {
		this.store.dispatch(new UpcomingAppointmentPageRequested({ page: this.queryParams, viewDate: "" }));
		this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
			// this.allAppointments = res.items;
			this.futureAppointments = res.data;

			if (this.futureAppointments && this.futureAppointments) {
				this.futureAppointments = this.futureAppointments.filter(item => item.appointmentStatus == "Confirmed");
				this.events = this.futureAppointments.map(appointmentlist => {
					let starthour = ((moment(appointmentlist.starttime, 'hh:mm A').format('HH:mm')).split(":"))[0];
					let startmin = ((moment(appointmentlist.starttime, 'hh:mm A').format('HH:mm')).split(":"))[1];
					let endhour = ((moment(appointmentlist.endtime, 'hh:mm A').format('HH:mm')).split(":"))[0];
					let endmin = ((moment(appointmentlist.endtime, 'hh:mm A').format('HH:mm')).split(":"))[1];
					const formattedStarttime = (moment(appointmentlist.date)).set({ hour: parseInt(starthour, 10), minute: parseInt(startmin, 10) }).toDate();
					const formattedEndtime = (moment(appointmentlist.date)).set({ hour: parseInt(endhour, 10), minute: parseInt(endmin, 10) }).toDate();
					return {
						start: formattedStarttime,
						end: formattedEndtime,
						colors: colors.red,
						title: appointmentlist.practitioner,
						myActions: appointmentlist,
						draggable: true
					};
				})
			}
		})
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

}
