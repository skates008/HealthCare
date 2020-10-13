import {
	Component,
	OnInit,
	Input
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../app/core/reducers';
import { ToastrService } from 'ngx-toastr';

import {
	Appointment,
	GetParticipantById,
	selectgetPatientById,
	CareplanDeleted
} from '../../../../../app/core/auth';

// Layout config
import {
	LayoutConfigService,
	SubheaderService
} from '../../../../../app/core/_base/layout';

// Angular Material
import { MatDialog } from '@angular/material';
import { QueryParamsModel, MessageType, LayoutUtilsService } from '../../../../core/_base/crud';
import moment from 'moment';
// import { ProviderAppointmentsAddComponent } from 'src/app/modules/provider-appointments/appointments-add/appointments-add.component';

@Component({
	selector: 'kt-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	@Input() data: { labels: string[]; datasets: any[] };
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param layoutConfigService
	 */

	participant: any;
	allAppointments: any;
	hasFormErrors = true;
	nextAppointmentDate: Date;
	hasAssessment: boolean = false;
	hasAgreement: boolean = false;
	nextAppointment: any;
	hasNextAppointment = false;
	displayedColumns: string[] = ['No.', 'Manufacturer', 'Medicine Name', 'formOfMedicine', 'Amount', 'Expiration Date'];
	displayedColumnsAllergy: string[] = ['No.', 'Clinical Status', 'Critical', 'Category', 'Last Occurence Date'];
	displayedColumnsCareplan: string[] = ['status', 'title', 'totalBudget', 'remainingFunds', 'createdDate', 'startDate', 'dueDate', 'reviewDate', 'actions'];
	 // displayedColumnsTimeEntry: string[] = ['No.', 'name', 'Careplan', 'actions'];
	// Public properties
	// displayedColumnsAppointmentUpRecent = ['date', 'practitioner', 'startTime', 'endTime', 'location', 'actions' ];

	participantId: any;
	queryParams: any;
	medicationDataSource: any;
	observationDataSource: any;
	assesmentDataSource: any;
	dataSource: any;
	dataSourceAllergies: any;
	dataSourceCareplans: any;
	allergyDataSource: any;
	custodiansDataSource: any;
	treatmentNoteDataSource: any;
	TimeEntryDataSource: any;
	careplanDataSource: any;
	allergyhasItems = true;
	custodianshasItems = true;
	careplanhasItems = true;
	medicationhasItems = true;
	observationhasItems = true;
	assesmenthasItems = true;
	treatmentNotehasItems = true;
	timeEntryHasItems = true;
	pastAppointments: any;
	arrivedAppointmentArray: any;
	assessmentList: any;
	observationList: any;
	treatmentList: any;
	viewLoading = false;
	loadingAfterSubmit = false;
	selectedTab = false;
	selectedTabParticipant = false;
	nextAppointmentStartTime: any;
	nextAppointmentEndTime: any;
	appointmentList: any;
	dialogOpen: any;
	appointmenthasItems;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private subheaderService: SubheaderService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog,
		private toastr: ToastrService,
		private layoutUtilsService: LayoutUtilsService
	) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			this.participantId = this.router.getCurrentNavigation().extras.state.appointmentDate;
		}
	}

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				this.participantId = params['id'];
				this.store.dispatch(new GetParticipantById({ participant_id: this.participantId }));
				this.store.pipe(select(selectgetPatientById)).subscribe(res => {
					this.participant = res;
					if (this.participant) {
						this.loadMedications();
						this.loadAllergy();
						this.loadCareplan();
						this.loadObservations();
						this.loadAssessments();
						this.loadtreatmentNotes();
						// this.initInvoice();
						// this.loadNextAppointment();
						// this.loadTimeEntry();
						// this.loadAppointmentsList();
						this.loadcustodians();
						this.assessment();
						this.agreement();
					}
				});
			}
		);

		this.queryParams = new QueryParamsModel(
			this.filterConfiguration()
		);
	}

	initInvoice() {
		this.subheaderService.setTitle('Client Record');
		// this.subheaderService.setBreadcrumbs([
		// 	{ title: 'Participant Details' },
		// 	{ title: this.participant.firstName + ' ' + this.participant.lastName },
		// ]);
	}

	deleteCareplan(item) {
		const title = 'Care plan Delete';
		const description = 'Are you sure you want to permanently delete this Care plan?';
		const waitDescription = 'Care plan is deleting..';
		const deleteMessage = 'Care plan has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new CareplanDeleted({ id: item}));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			this.loadCareplan();
		});
	}

	// bookAppointment() {
	// 	const newAppointment = new Appointment();
	// 	newAppointment.clear(); // Set all defaults fields
	// 	const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent,
	// 		{ data: { appointmentId: newAppointment.id, participantDetails: this.participant } });
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (res) {
	// 			this.store.dispatch(new GetParticipantById({ participant_id: this.participantId }));
	// 			this.loadNextAppointment();
	// 			this.toastr.success('Appointment successfully has been created', 'Success', {
	// 				timeOut: 5000
	// 			});
	// 		}
	// 	});
	// }

	viewCareplan(carePlan) {
		this.router.navigate(['../../../../careplans/careplan-details', carePlan.id], {
			relativeTo: this.activatedRoute, state: {
				Careplan: carePlan
			}
		});
	}

	edit(id) {
		this.router.navigate(['../../../participants/edit', id], {
			relativeTo: this.activatedRoute
		});
	}

	loadMedications() {
		this.medicationDataSource = this.participant.medications;
		if (this.medicationDataSource.length == 0) {
			this.medicationhasItems = false;
		} else {
			this.medicationhasItems = true;
		}
	}

	loadObservations() {
		this.observationDataSource = this.participant.observations;
		if (this.observationDataSource.length == 0) {
			this.observationhasItems = false;
		} else {
			this.observationhasItems = true;
		}
	}

	agreement() {
		if (!(this.participant.warnings[1])) {
			this.hasAgreement = false;
		} else {
			this.hasAgreement = true;
		}
	}

	assessment() {
		if (!(this.participant.warnings[2])) {
			this.hasAssessment = false;
		} else {
			this.hasAssessment = true;
		}
	}


	loadAssessments() {
		this.assesmentDataSource = this.participant.assesments;
		if (this.assesmentDataSource.length == 0) {
			this.assesmenthasItems = false;
		} else {
			this.assesmenthasItems = true;
		}
	}

	loadtreatmentNotes() {
		this.treatmentNoteDataSource = this.participant.treatmentNotes;
		if (this.treatmentNoteDataSource.length == 0) {
			this.treatmentNotehasItems = false;
		} else {
			this.treatmentNotehasItems = true;
		}
	}

	loadAllergy() {
		this.allergyDataSource = this.participant.allergies;
		if (this.allergyDataSource.length == 0) {
			this.allergyhasItems = false;
		} else {
			this.allergyhasItems = true;
		}
	}

	loadcustodians() {
		this.custodiansDataSource = this.participant.custodians;
		if (this.custodiansDataSource.length == 0) {
			this.custodianshasItems = false;
		} else {
			this.custodianshasItems = true;
		}
	}

	// loadAppointmentsList() {



	// 	this.appointmentList = this.participant.nextAppointments.filter(
	// 		nextAppointment => nextAppointment.id !== this.nextAppointment.id
	// 	);
	// }

	loadCareplan() {
		this.careplanDataSource = this.participant.carePlans;
		if (this.careplanDataSource.length == 0) {
			this.careplanhasItems = false;
		} else {
			this.careplanhasItems = true;
		}
	}

	loadTimeEntry() {
		this.TimeEntryDataSource = this.participant.timeEntry;

		if (this.TimeEntryDataSource.length == 0) {
			this.timeEntryHasItems = false;
		} else {
			this.timeEntryHasItems = true;
		}
	}


	loadNextAppointment() {
		if (this.participant.nextAppointment) {
			this.nextAppointment = this.participant.nextAppointment;
			this.nextAppointmentStartTime = moment(this.participant.nextAppointment.startTime).format('h:mm a');
			this.nextAppointmentEndTime = moment(this.participant.nextAppointment.endTime).format('h:mm a');
			this.hasNextAppointment = true;
		} else {
			this.hasNextAppointment = false;
		}
	}

	getHistory(id) {
		this.router.navigate(['../../history', id], { relativeTo: this.activatedRoute });
	}

	goToBilling(id) {
		this.router.navigate(['../../billing', id], { relativeTo: this.activatedRoute })
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	addCarePlan(participant) {
		this.router.navigate(['../../../../careplans/careplans/add'], {
			state:
				{ participant: participant }
		});
	}


	createInvoice(id) {
		this.router.navigate(['../../../../invoices/invoice-details', id], { relativeTo: this.activatedRoute })
	}

	addTimeEntry(participant) {
		this.router.navigate(['../../../../times/timeEntry/add'], {
			state:
				{ participant: participant }
		});
	}

	viewTimeEntry(id) {
		this.router.navigate(['../../../../times/timeEntry-details', id], {
			relativeTo: this.activatedRoute, state: {
				timeEntryId: id
			}
		});
	}

		/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertCloseCareplan($event) {
		this.careplanhasItems = true;
	}

		/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertCloseAssessment($event) {
		this.hasAssessment = false;
	}

		/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertCloseAgreement($event) {
		this.hasAgreement = false;
	}

}
