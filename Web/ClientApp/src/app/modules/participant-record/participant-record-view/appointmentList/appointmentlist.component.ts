// Angular
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {
	Appointment,
	GetParticipantById,
	AppointmentsPageRequested,
	selectQueryResultAppointment,
	AuthService
} from '../../../../core/auth';
import { ParticipantService } from '../../../../core/_services';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { ToastrService } from 'ngx-toastr';
import { QueryParamsModel } from '../../../../core/_base/crud';
import { EventsDialogComponent } from '../../../provider-appointments/events-dialog/events-dialog.component';
import { EventsDialogCheckinComponent } from '../../../provider-appointments/events-dialog-checkin/events-dialog-checkin.component';
import { ProviderAppointmentsAddComponent } from '../../../provider-appointments/appointments-add/appointments-add.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'kt-appointmentlist',
	templateUrl: './appointmentlist.component.html',
	styleUrls: ['./appointmentlist.component.scss']
})
export class AppointmentListComponent implements OnInit {
	// Public properties
	displayedColumnsAppointmentUpRecent = ['date', 'practitioner', 'startTime', 'endTime', 'location', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	dataSource: any;
	@Input() participantId: string;
	appointmenthasItems = false;
	// participantId;
	participant;
	appointmentList: any;
	dialogOpen: any;
	participantDetails: any;

	/**
	 * Component constructor
	 *
	 * @param dataTableService: DataTableService
	 */
	constructor(
		private store: Store<AppState>,
		private dialog: MatDialog,
		private toastr: ToastrService,
		private auth: AuthService,
		private participantData: ParticipantService,
	 private activatedRoute: ActivatedRoute,
  private router: Router,
	) { }

	/**
	 * On initopenAppointment
	 */
	ngOnInit() {
		// First load
		this.loadAppointments();
		this.loadParticipantDetails(this.participantId);
		this.dataSource = this.appointmentList;
	}

	loadAppointments() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);

		const appointmentParams = {
			StartDate: '2010-05-31T18:15:00.000Z',
			EndDate: '2030-05-31T18:15:00.000Z',
			PractitionerId: '',
			ParticipantId: this.participantId
		};

		this.store.dispatch(new AppointmentsPageRequested({
			page: queryParams,
			appointmentParams
		}));

		this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
			// if (res.data.length === 0) {
			// 	this.appointmenthasItems = false;
			// 	return;
			// }
			if (res.data.length > 0) {
				this.appointmenthasItems = true;
				this.appointmentList = res.data;
			} else {
				this.appointmenthasItems = false;
			}
		});
	}


	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	bookAppointment(participantId) {
		const newAppointment = new Appointment();
		newAppointment.clear(); // Set all defaults fields

		const saveMessage = `Appointment successfully has been created.`;
		const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, {
			data: {  participantDetails: this.participantDetails  }   });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			this.loadAppointments();
			this.toastr.success('Appointment successfully has been created', 'Success', {
				timeOut: 5000
			});
			}
		});
	}

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
				let id = res.appointmentId;
				this.router.navigate(['../../../../provider-appointments/appointment-details', id], {
				relativeTo: this.activatedRoute
			  });
			}

			if (res) {
				this.store.dispatch(new GetParticipantById({ participant_id: this.participantId }));
				this.loadAppointments();
			}
		});

	}

	loadParticipantDetails(id) {
		this.participantData.getParticipantById(id).subscribe(res => {
			this.participantDetails = res.data;
		});
	}

}
