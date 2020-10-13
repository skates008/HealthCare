import {
	Component, OnInit, ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query, ViewChild
} from '@angular/core';

import { selectParticipantById, selectParticipantsActionLoading, MedicationsPageRequested, selectMedicationByParticipantId, MedicationDeleted, AllergyPageRequested, selectAllergiesByParticipantId, AllergyDeleted, BudgetPageRequested, selectBudgetByParticipantId, BudgetDeleted, MedicationDataSource, AllergyDataSource, ParticipantsPageRequested, ParticipantProfilePageRequested, selectParticipantsInStore } from './../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryParamsModel } from './../../../core/_base/crud';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { MedicationComponent } from '../participant-profile-view/medication/medication.component';
import { AllergyComponent } from '../participant-profile-view/allergy/allergy.component';
import { BudgetComponent } from '../participant-profile-view/budget/budget.component';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';


@Component({
	selector: 'kt-participant-profile-view',
	templateUrl: './participant-profile-view.component.html',
	styleUrls: ['./participant-profile-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ParticipantProfileViewComponent implements OnInit {
	@ViewChild('paginator', { static: true }) paginator: MatPaginator;
	@ViewChild('paginator2', { static: true }) paginator2: MatPaginator;


	participant_details: object;
	loading$: Observable<boolean>;
	medicationList: any;
	allergyList: any;
	showEdit: boolean = true;
	showMed: boolean = false;
	showAllergies: boolean = false;
	showBudget: boolean = false;
	displayedColumns: string[] = ['No.', 'Manufacturer', "Medicine Name", 'Form', 'Amount', 'Frequency', 'Expiration Date', 'Actions'];
	dataSource: MedicationDataSource;
	titleText: string = "Basic Information";
	displayedColumnsAllergy: string[] = ['No.', 'Clinical Status', 'Critical', 'Category', 'Allergen', 'Last Occurence Date', 'Actions'];
	dataSourceAllergies: any;
	budgetData: any;
	medicationDataSource: any;
	allergyDataSource: any;
	private subscriptions: Subscription[] = [];
	participantId: string;
	queryParams: any;
	selectedTab: number = 0;
	viewLoading: boolean = false;
  	loadingAfterSubmit: boolean = false;

	constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute, private layoutUtilsService: LayoutUtilsService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectParticipantsActionLoading));

		// this.participantId = JSON.parse(localStorage.getItem('user_data')).user_details.loginInfo.userId;
		// this.participantId = "F9536B7C-714C-4AC7-9B93-9F432153BFA6";

		this.queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);

		this.loadMedications();
		this.loadAllergy();
		this.loadBudget();

		// call request for participant
		this.store.dispatch(new ParticipantProfilePageRequested({}));
		this.store.pipe(select(selectParticipantsInStore)).subscribe(res => {
			if (res) {
				this.participant_details = res.data[0];
			}
		});
	}

	edit(participantId) {
		this.router.navigate(['../edit'], { relativeTo: this.activatedRoute });
	}

	loadMedications() {
		this.store.dispatch(new MedicationsPageRequested({
			page: this.queryParams, participant_id: this.participantId
		}));
		this.dataSource = new MedicationDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.medicationDataSource = res;
		});
	}

	loadAllergy() {
		this.store.dispatch(new AllergyPageRequested({ page: this.queryParams, participant_id: this.participantId }));
		this.dataSourceAllergies = new AllergyDataSource(this.store);

		this.dataSourceAllergies.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.allergyDataSource = res;
		});

	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	addMedication() {
		const _saveMessage = `Medication successfully has been added.`;
		const dialogRef = this.dialog.open(MedicationComponent);

		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 10000, true, true);
			this.loadMedications();
		});
	}

	addAllergies() {
		const _saveMessage = `Allergy successfully has been added.`;
		const dialogRef = this.dialog.open(AllergyComponent);

		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 10000, true, true);
			this.loadAllergy();
		});
	}

	deleteMedication(id) {
		const _title: string = 'Medication Delete';
		const _description: string = 'Are you sure you want to permanently delete this Medication?';
		const _waitDescription: string = 'Medication is deleting..';
		const _deleteMessage: string = 'Medication has been deleted';
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.store.dispatch(new MedicationDeleted({ id: id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}


	deleteAllergy(id) {
		const _title: string = 'Alergy Delete';
		const _description: string = 'Are you sure you want to permanently delete this Allergy?';
		const _waitDescription: string = 'Allergy is deleting..';
		const _deleteMessage: string = 'Allergy has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.store.dispatch(new AllergyDeleted({ id: id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);

		});
	}

	addBudget(id) {
		const _saveMessage = `Budget successfully has been added.`;
		const dialogRef = this.dialog.open(BudgetComponent);

		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 10000, true, true);
			this.loadBudget();
		});
	}

	delteBudget(id) {
		const _title: string = 'Budget Delete';
		const _description: string = 'Are you sure you want to permanently delete this Budget?';
		const _waitDescription: string = 'Budget is deleting..';
		const _deleteMessage: string = 'Budget has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.store.dispatch(new BudgetDeleted({ id: id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	loadBudget(){
		// call request for budget
		this.store.dispatch(new BudgetPageRequested({ page: this.queryParams, participant_id: this.participantId }));
		this.store.pipe(select(selectBudgetByParticipantId(this.participantId))).subscribe(res => {
			if (res) {
				this.budgetData = res;
			}
		});
	}

	addCareplan(id) {
		this.router.navigate(['../../participant-careplan/careplans/add'], { relativeTo: this.activatedRoute });
	}

	tabClick(event) {
		if (event.index == 0) {
			this.showEdit = true;
			this.showAllergies = false;
			this.showBudget = false;
			this.showMed = false;
			this.titleText = "Basic Information";
		} else if (event.index == 1) {
			this.showEdit = false;
			this.showAllergies = false;
			this.showBudget = false;
			this.showMed = true;
			this.titleText = "Medication"
		} else if (event.index == 2) {
			this.showAllergies = true;
			this.showEdit = false;
			this.showBudget = false;
			this.showMed = false;
			this.titleText = "Allergies"
		} else if (event.index == 3) {
			this.showBudget = true;
			this.showAllergies = false;
			this.showEdit = false;
			this.showMed = false;
			this.titleText = "Budget"
		}
	}

}
