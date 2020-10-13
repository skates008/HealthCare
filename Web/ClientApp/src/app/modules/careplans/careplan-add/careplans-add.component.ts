import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, NgModule, OnDestroy, Inject, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
// import { selectUsersActionLoading, selectUserById, User } from 'src/app/core/auth';
// import { UseExistingWebDriver } from 'protractor/built/driverProviders';

import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';

// Services and Models
import {
	Careplan,
	CareplanUpdated,
	selectHasCareplansInStore,
	selectCareplanById,
	CareplanOnServerCreated,
	selectLastCreatedCareplanId,
	selectCareplansActionLoading,
	ParticipantsPageRequested,
	Notification,
	NotificationOnServerCreated,
	selectParticipantsInStore,
	currentUser,
	PractitionerPageRequested,
	selectPractitionerInStore,
	CarePlanEditPageRequested,
	selectCareplansInStore,
	GetBudgetByPatient,
	selectFundedBudgetbyPatient,
	selectIsCareplanCreateSuccess,
	GetBillingType,
	selectBillingType,
	selectInvoicesInStore
} from '../../../core/auth';
import { AppState } from '../../../core/reducers';
import { SubheaderService, LayoutConfigService } from '../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../core/_base/crud';

import { MatDatepicker, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatAutocomplete } from '@angular/material';

import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import moment from 'moment';
// import { timingSafeEqual } from 'crypto';


@Component({
	selector: 'kt-careplans-add',
	templateUrl: './careplans-add.component.html',
	styleUrls: ['./careplans-add.component.scss'],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
	],
})
export class CareplansAddComponent implements OnInit {
	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	@ViewChild('startpicker', { static: true }) datePicker1: MatDatepicker<Date>;
	@ViewChild('reviewpicker', { static: true }) datePicker2: MatDatepicker<Date>;
	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('stages', { static: true }) ele: ElementRef;
	
	careplanForm: FormGroup;
	careplanFormFundedSupport: FormGroup;
	careplanFormFamilyGoal: FormGroup;
	private subscriptions: Subscription[] = [];
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	hasFormErrors: boolean = false;
	careplanDetails: any;
	participantDetails: any;
	participantList: any;
	budgetPlan: any;
	practitionerList: any;
	currentParticipant: any;
	hideTab: boolean = false;
	currentParticipantId: string;
	currentParticipantFullName: string;
	panelOpenState = false;
	billingType: any;
	showHideBilling = false;

	// chip example
	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	subPractitionerCtrl = new FormControl();
	filteredsubPractitioners: Observable<string[]>;
	subPractitioners: string[] = [];
	allsubPractitioners: string[] = [];
	selectedTherapist: any = [];
	subpractitionerList: any;

	@ViewChild('subPractitionerInput', {static: false}) subPractitionerInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

	constructor(
		private _fb: FormBuilder,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private _location: Location
		) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			// this.appointmentDetails = this.router.getCurrentNavigation().extras.state;
			this.participantDetails = this.router.getCurrentNavigation().extras.state.participant;
			this.careplanDetails = this.router.getCurrentNavigation().extras.state.careplan;
		}

		this.currentParticipantId = this.participantDetails.id;
		this.currentParticipantFullName = this.participantDetails.fullName;
		if(this.currentParticipantId){
			this.listBudgetByPatientId(this.currentParticipantId);
		}

		this.filteredsubPractitioners = this.subPractitionerCtrl.valueChanges.pipe(
			startWith(null),
			map((subPractitioner: string | null) => subPractitioner ? this._filter(subPractitioner) : this.allsubPractitioners.slice()));
	}

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectCareplansActionLoading));
		this.loadPractitioner();
		this.loadParticipants();
		// this.getBillingType();
		this.listBudgetByPatientId(this.participantDetails.id);

	 this.careplanForm = this._fb.group({
		title: ['', [Validators.required, Validators.minLength(2)]],
		startDate: [''],
		dueDate: [new Date()],
		practitioner: [null, Validators.required],
		serviceBookingReference: [null],
		// billingType: [null],
		patientId: [''],
		status: ['', Validators.required]
	  });

	 this.careplanFormFamilyGoal = this._fb.group({
		familyGoalArray: this._fb.array([
			this.addFamilyGoalGroup()
		])
	  });

	 this.careplanFormFundedSupport = this._fb.group({
		fundAllocated: [],
		fundCategoryId: [1],
		budgetPlanId: []
	  	});
	}

	addFamilyGoalGroup() {
		return this._fb.group({
		  title: [''],
		  strategy: [''],
		  support: [''],
		  shortTermGoals: this._fb.array([
		]),
		});
	  }


	//   get familyGoalArray1() {
	// 	  console.log('familyGoalArray1 called');
	// 	return <FormArray>this.careplanFormFamilyGoal.get('familyGoalArray');
	//   }
	
	  addFamilyGoal() {
		var _arr = <FormArray>this.careplanFormFamilyGoal.get('familyGoalArray');
		_arr.push(this.addFamilyGoalGroup());
	  }

	  removeFamilyGoal(index) {
		var _arr = <FormArray>this.careplanFormFamilyGoal.get('familyGoalArray');
		_arr.removeAt(index);
	  }

	  	// add ShortTermG goal
	addShortTermGoals(i) {
		// let shortTermGoalFormArray = this.newCareplanFormGroup.controls.shortTermGoals as FormArray;
		// let arraylen = shortTermGoalFormArray.length;
		this.panelOpenState = true;
		let newShortTermFormGroup: FormGroup = this._fb.group({
			title: [''],
			description: [''],
			outcome: [],
			outcomeDetail: [''],
			strategy: ['']
		});

		var _arr = <FormArray>this.careplanFormFamilyGoal.get('familyGoalArray');
		var  _formgroup = _arr.at(i);
		var _shorttermarr = _formgroup.get('shortTermGoals') as FormArray;

		_shorttermarr.push(newShortTermFormGroup);
	}

	// delete careplan goal item
	deleteMyGoalItem(i, j) {
		var _arr = <FormArray>this.careplanFormFamilyGoal.get('familyGoalArray');;
		var  _formgroup = _arr.at(i);
		let  _child = _formgroup as FormGroup;
		let goal = _child.controls.shortTermGoals as FormArray;
		goal.removeAt(j);

	}

	initCareplan() {
		this.subheaderService.setTitle('Add Careplan');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Add careplan', page: `/careplan/careplans/add` }
		]);
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our subPractitioner
		if ((value || '').trim()) {
		  this.subPractitioners.push(value.trim());
		}

		// Reset the input value
		if (input) {
		  input.value = '';
		}

		this.subPractitionerCtrl.setValue(null);
	  }

	  remove(subPractitioner: any): void {
		const index = this.selectedTherapist.findIndex(x => x.id === subPractitioner.id);

		if (index >= 0) {
		  this.selectedTherapist.splice(index, 1);
		  this.subpractitionerList.push(subPractitioner);
		}
	  }

	  selected(event: any): void {
		const _obj = {id: event.option.value.id, text: event.option.value.text};
		this.selectedTherapist.push(_obj);
		this.subPractitionerInput.nativeElement.value = '';
		this.subPractitionerCtrl.setValue(null);

		let index = this.subpractitionerList.findIndex(x => x.id === _obj.id);
		this.subpractitionerList.splice(index, 1);
	  }

	  private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allsubPractitioners.filter(subPractitioner => subPractitioner.toLowerCase().indexOf(filterValue) === 0);
	  }

	submitHandler() {
		var _careplanlan = this.careplanForm.value;
		var _familyGoal = this.careplanFormFamilyGoal.value;
		let _budget = this.careplanFormFundedSupport.value;

		let _obj = new Careplan();

		_obj.title = _careplanlan.title;
		_obj.startDate = moment(_careplanlan.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS');
		_obj.dueDate = _careplanlan.dueDate;
		_obj.keyPractitionerId = _careplanlan.practitioner;
		_obj.serviceBookingReference = _careplanlan.serviceBookingReference;
		// _obj.billingType = _careplanlan.billingType;
		_obj.patientId = this.currentParticipantId;
		_obj.status = _careplanlan.status;

		_obj.familyGoals = _familyGoal.familyGoalArray;

		_obj.fundedSupport = [{
			fundAllocated: _budget.fundAllocated,
			budgetPlanId: _budget.budgetPlanId,
			fundCategoryId: _budget.fundCategoryId,
		}];

		_obj.practitioners = this.selectedTherapist;

		const controls = this.careplanForm.controls;

		if (!this.careplanForm.valid || !this.careplanFormFundedSupport.valid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
		} else {
			this.addCareplan(_obj);
		}

	}

	getComponentTitle() {
		const result = `Create care plan for ${this.currentParticipantFullName}`;
		return result;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	nextStep() {
		if (this.selectedTab <= 1) {
		  this.selectedTab = this.selectedTab + 1;
		  this.hideTab = false;
		  if(this.selectedTab == 2){
			this.hideTab = true;
		  }
		} else {
			this.hideTab = true;
		}
	  }

	  goBackToList() {
		this._location.back();
		// const url = `/careplans/careplans`;
		// this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	  }

	addCareplan(_careplan: Careplan) {
		this.store.dispatch(new CareplanOnServerCreated({ careplan: _careplan }));
		const addSubscription = this.store.pipe(select(selectIsCareplanCreateSuccess)).subscribe(success => {
			if(success){
			const message = `New careplan successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);	
			this.goBackToList()
		  }
		});
		this.subscriptions.push(addSubscription);
	}


	loadParticipants() {
		let queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new ParticipantsPageRequested({ page: queryParams }));
		this.store.pipe(select(selectParticipantsInStore)).subscribe(res => {
			if (res.total == 0) {
				return;
			}
			this.participantList = res;
		})
	}


	listBudgetByPatientId(participantId){
		// this.store.dispatch(new GetBudgetByPatient({ participant_id: participantId }));
		// this.store.pipe(select(selectFundedBudgetbyPatient)).subscribe(res => {
		// 	// response of funded budget
		// 	if(res){
		// 		this.budgetPlan = res
		// 	}
		// })
	}

	// getBillingType() {
	// 	let queryParams = new QueryParamsModel(
	// 		this.filterConfiguration(),
	// 	);
	// 	this.store.dispatch(new GetBillingType({ page: queryParams }));
	// 	this.store.pipe(select(selectInvoicesInStore)).subscribe(res => {
	// 		// response of billing type
	// 		if (res) {
	// 			this.billingType = res
	// 		}
	// 	});
	// }

	practitionerSelected(value) {
		this.subpractitionerList = Object.assign([], this.practitionerList);
		let index = this.subpractitionerList.findIndex(x => x.id === value);
		this.subpractitionerList.splice(index, 1);
	}
	
		// show hides reference number based on selection
		billingSelected(value) {
			if (value === 'AGENCY_MANAGED') {
				this.showHideBilling = true;
			} else {
				this.showHideBilling = false;
			}
		}

	loadPractitioner(){
        let queryParams = new QueryParamsModel(
          this.filterConfiguration(),
        );
        this.store.dispatch(new PractitionerPageRequested({ page: queryParams }));
        this.store.pipe(select(selectPractitionerInStore)).subscribe(res => {

          if (res.total == 0) {
            return;
		  }
		  
		        this.practitionerList = res.data;    
		        this.subpractitionerList = Object.assign([], this.practitionerList);
      })
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	back() {
		this.selectedTab = this.selectedTab - 1;
		if (this.selectedTab === -1){
			const url = `/participant-record/participants`;
			this._location.back();
				// this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
		}
	}
  }

