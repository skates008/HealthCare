// Angular
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
// RXJS
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import {
	Appointment,
	GetParticipantById,
	AppointmentsPageRequested,
	selectQueryResultAppointment,
	selectRecentAppointments
} from '../../../../../../src/app/core/auth';
import { AppointmentService, ParticipantService } from '../../../../../../src/app/core/_services';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../app/core/reducers';
import { ToastrService } from 'ngx-toastr';
import { QueryParamsModel } from '../../../../core/_base/crud';
import { ProviderAppointmentsAddComponent } from '../../../provider-appointments/appointments-add/appointments-add.component';
import { EventsDialogComponent } from '../../../provider-appointments/events-dialog/events-dialog.component';
import { EventsDialogCheckinComponent } from '../../../provider-appointments/events-dialog-checkin/events-dialog-checkin.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'kt-appointment',
	templateUrl: './appointment.component.html',
	styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
	// Public properties
	displayedColumnsAppointment = ['date', 'startTime', 'endTime', 'location', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	dataSource: any;
	@Input() participantId: string;
	requestAppointments: any;
	appointmenthasItems = false;
	// participantId;
	participant;
	recentAppointments;
	upcomingAppointments;
	participantDetails: any;
	dialogOpen: any;
	recentAppointmenthasItems = false;

	/**
	 * Component constructor
	 *
	 * @param dataTableService: DataTableService
	 */
	constructor(
		private store: Store<AppState>,
		private dialog: MatDialog,
		private toastr: ToastrService,
		private auth: AppointmentService,
		private participantData: ParticipantService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
	) { }

	/**
	 * On init
	 */
	ngOnInit() {
		// First load
		this.recentAppointment();
		this.upcomingAppointment();
		this.dataSource = this.requestAppointments;
		this.loadParticipantDetails(this.participantId);
	}

	recentAppointment() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);

		const appointmentParams = {
			results: -3,
			ParticipantId: this.participantId
		};

		this.store.dispatch(new AppointmentsPageRequested({
			page: queryParams,
			appointmentParams
		}));

		this.store.pipe(select(selectRecentAppointments)).subscribe(res => {
			if (res.data.length > 0) {
			// if (res.total === 0) {
			// 	this.appointmenthasItems = false;
			// 	return;
			// }
			this.recentAppointmenthasItems = true;
			this.recentAppointments = res.data;
			} else {
				this.recentAppointmenthasItems = false;
			}
		});
	}

	upcomingAppointment() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);

		const appointmentParams = {
			results: +3,
			ParticipantId: this.participantId
		};

		this.store.dispatch(new AppointmentsPageRequested({
			page: queryParams,
			appointmentParams
		}));

		this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
			if (res.data.length > 0) {
				this.appointmenthasItems = true;
				this.upcomingAppointments = res.data;
			} else {
				this.appointmenthasItems = false;
			}
		});
	}

	// loadAppointments() {
	// 	const queryParams = new QueryParamsModel(
	// 		this.filterConfiguration(),
	// 	);

	// 	const appointmentParams = {
	// 		StartDate: '2019-05-31T18:15:00.000Z',
	// 		EndDate: '2030-05-31T18:15:00.000Z',
	// 		results: '+3',
	// 		ParticipantId: this.participantId
	// 	};

	// 	this.store.dispatch(new AppointmentsPageRequested({
	// 		page: queryParams,
	// 		appointmentParams
	// 	}));

	// 	this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
	// 		if (res.items.length === 0) {
	// 			this.appointmenthasItems = false;
	// 			return;
	// 		}
	// 		this.appointmenthasItems = true;
	// 		this.requestAppointments = res.items;
	// 	});
	// }

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	bookAppointment() {
		const newAppointment = new Appointment();
		newAppointment.clear(); // Set all defaults fields

		const saveMessage = `Appointment successfully has been created.`;
		const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, {
		data: {  participantDetails: this.participantDetails  }   });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			this.toastr.success('Appointment successfully has been created', 'Success', {
				timeOut: 5000
			});
			this.recentAppointment();
			this.upcomingAppointment();
			}
		});
	}

	loadParticipantDetails(id){
		this.participantData.getParticipantById(id).subscribe(res=>{
			this.participantDetails = res.data;
		});
	}

	// openAppointment(item) {
	// 	if (item.appointmentStatus == 'Completed') {
	// 		this.dialogOpen = EventsDialogComponent;
	// 	} else {
	// 		this.dialogOpen = EventsDialogCheckinComponent;
	// 	}
	// 	const dialogRefEvenet = this.dialog.open(this.dialogOpen, {
	// 		width: '500px',
	// 		data: { eventDetails: item }
	// 	});
	// 	dialogRefEvenet.afterClosed().subscribe(res => {
	// 		if (res) {

	// 		}
	// 	});

	// }

	openAppointment(item) {
		if (item.appointmentStatus == 'Completed') {
			this.dialogOpen = EventsDialogComponent;
		} else {
			this.dialogOpen = EventsDialogCheckinComponent;
		}
		const dialogRefEvenet = this.dialog.open(this.dialogOpen, {
			width: '650px',
			data: { eventDetails: item }
		});
		dialogRefEvenet.afterClosed().subscribe(res => {
			if (res && res.appointmentId) {
				const id = res.appointmentId;
				this.router.navigate(['../../../../provider-appointments/appointment-details', id], {
				relativeTo: this.activatedRoute
			  });
			}
			// if (res) {
				// this.toastr.success('Appointment has been cancelled successfully', 'Success', {
				// 	timeOut: 5000
				// });
				// this.store.dispatch(new GetParticipantById({ participant_id: this.participantId }));
			// }
			// console.log("hello1234");
		});

	}

}
