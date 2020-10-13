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
	CareplanOnServerCreated,
	selectLastCreatedCareplanId,
	selectCareplansActionLoading,
	ParticipantsPageRequested,
	Notification,
	selectParticipantsInStore,
	PractitionerPageRequested,
	selectPractitionerInStore,
	CarePlanEditPageRequested,
	selectEditPageList,
	GetBillingType,
	selectBillingType
} from '../../../core/auth';
import { AppState } from '../../../core/reducers';
import { SubheaderService, LayoutConfigService } from '../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../core/_base/crud';

import {
	MatDatepicker,
	MatDialog,
	MatAutocomplete,
	MatChipInputEvent
} from '@angular/material';

import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { startWith, map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-careplans-edit',
	templateUrl: './careplans-edit.component.html',
	styleUrls: ['./careplans-edit.component.scss'],
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
export class CareplansEditComponent implements OnInit, OnDestroy {

	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	@ViewChild('startpicker', { static: true }) datePicker1: MatDatepicker<Date>;
	@ViewChild('reviewpicker', { static: true }) datePicker2: MatDatepicker<Date>;
	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('stages', { static: true }) ele: ElementRef;

	// chip example
	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	subPractitionerCtrl = new FormControl();
	hideTab = false;
	filteredsubPractitioners: Observable<string[]>;
	subPractitioners: string[] = [];
	allsubPractitioners: string[] = [];

	billingTypeList: any;
	currentParticipant: any;
	showHideBilling = false;
	careplan: Careplan;
	careplanId$: Observable<number>;
	oldCareplan: Careplan;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	careplanForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	participant = [];
	appointmentDetails: object;
	NDISvalid = '[43]{2}[A-Za-z0-9]{7,7}';
	participantList: any;
	resetButton: boolean = false;
	participantDetails: any;
	newCareplanFormGroup: FormGroup;
	newPractitionerFormGroup: FormGroup;
	practitionerList: any;
	subpractitionerList: any;
	currentPractitioner: any;
	careplanDetails: any;
	budgetPlan: any;
	NewShortTermGoal: any = 'New Short Terms';
	selectedTherapist: any = [];
	panelOpenState = false;

	@Output() onItemAdd: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild('subPractitionerInput', { static: false }) subPractitionerInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

	constructor(
		private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private router: Router,
		private careplanFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private location: Location,
		private layoutConfigService: LayoutConfigService) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			// this.appointmentDetails = this.router.getCurrentNavigation().extras.state;
			this.participantDetails = this.router.getCurrentNavigation().extras.state.participant;
			this.careplanDetails = this.router.getCurrentNavigation().extras.state.careplan;
		}

		this.filteredsubPractitioners = this.subPractitionerCtrl.valueChanges.pipe(
			startWith(null),
			map((subPractitioner: string | null) => subPractitioner ? this._filter(subPractitioner) : this.allsubPractitioners.slice()));
	}

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectCareplansActionLoading));
		this.careplan = new Careplan();
		this.loadPractitioner();
		this.loadParticipants();
		this.getBillingType();
		this.listBudgetByPatientId(this.careplanDetails.patientId);

		this.newCareplanFormGroup = this.careplanFB.group({
			id: [],
			title: [],
			support: [],
			strategy: [],
			shortTermGoals: this.careplanFB.array([
			]),
		})

		this.newPractitionerFormGroup = this.careplanFB.group({
			id: [],
			name: []
		})

		this.careplanForm = this.careplanFB.group({
			created: [new Date()],
			// billingType: [''],
			status: [this.careplan.status],
			title: [this.careplan.title, Validators.required],
			peroid: [new Date()],
			address: [this.careplan.address],
			goal: [this.careplan.goal],
			serviceBookingReference: [this.careplan.serviceBookingReference],
			frequency: [this.careplan.frequency],
			budget: [this.careplan.budget],
			intent: [this.careplan.intent],
			category: [this.careplan.category],
			note: [this.careplan.note],
			description: [this.careplan.description],
			NDISNumber: [this.careplan.NDISNumber, [Validators.pattern(this.NDISvalid), Validators.maxLength(9), Validators.minLength(9)]],
			NDISContact: [this.careplan.NDISContact],
			startDate: [this.careplan.startDate],
			dueDate: [this.careplan.dueDate],
			patientId: [''],
			practitioner: [''],
			appointments: [''],
			familyGoals: this.careplanFB.array([
			]),
			fundedSupport: this.careplanFB.array([
			]),
			practitioners: this.careplanFB.array([
			])
		})

		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id) {
				this.store.dispatch(new CarePlanEditPageRequested({ Careplan: this.careplanDetails }));
				// this is the real api
				this.store.pipe(select(selectEditPageList)).subscribe(res => {
					if (res) {
						this.careplan = res;
						this.initCareplan();
						this.listBudgetByPatientId(this.careplan.patientId);
						this.careplan.familyGoals.forEach(function (v, k) {
							const _formarr = this.careplanForm.get("familyGoals") as FormArray;
							var _formarray = this.newCareplanFormGroup.get("shortTermGoals") as FormArray;

							var _tmparr = [];
							v.shortTermGoals.forEach(function (g) {
								_tmparr.push(
									this.careplanFB.group({
										id: [g.id],
										title: [g.title],
										description: [g.description],
										outcome: [g.outcome],
										outcomeDetail: [g.outcomeDetail],
										strategy: [g.strategy]
									}));

							}.bind(this));

							var _parentgroup = this.careplanFB.group({
								id: [v.id],
								title: [v.title],
								support: [v.support],
								strategy: [v.strategy],
								shortTermGoals: this.careplanFB.array(_tmparr),
							});
							_formarr.push(_parentgroup);

						}.bind(this));

						this.careplan.fundedSupport.forEach(function (v) {
							const _formarr = this.careplanForm.get("fundedSupport") as FormArray;
							_formarr.push(this.careplanFB.group(v));
						}.bind(this));


						this.careplan.practitioners.forEach(function (v) {
							this.selectedTherapist.push({ id: v.id, text: v.name })
							let index = this.subpractitionerList.findIndex(x => x.id === v.id);
							this.subpractitionerList.splice(index, 1);
							// const _formarr = this.careplanForm.get("practitioners") as FormArray;
							// _formarr.push(this.careplanFB.group(v));
						}.bind(this));

						this.resetButton = true;
					}
				});
			}
		});
		this.subscriptions.push(routeSubscription);
	}


	ngAfterViewInit() {
		if (this.participantDetails) {
			this.careplan.participant = this.participantDetails.id;
		}
		this.careplanForm.controls['patientId'].setValue(this.careplan.participant);

		this.participantSelected(this.careplan.participant);
	}


	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initCareplan() {
		this.createForm(this.participantDetails);
		this.subheaderService.setTitle('Edit Careplan');
	}

	createForm(participantDetails) {
		if (participantDetails) {
			this.participant = participantDetails;
		}

		this.careplanForm = this.careplanFB.group({
			created: [new Date()],
			// billingType: [this.careplan.billingType],
			status: [this.careplan.status],
			title: [this.careplan.title, Validators.required],
			serviceBookingReference: [this.careplan.serviceBookingReference],
			peroid: [new Date()],
			address: [this.careplan.address],
			goal: [this.careplan.goal],
			frequency: [this.careplan.frequency],
			budget: [this.careplan.budget],
			intent: [this.careplan.intent],
			category: [this.careplan.category],
			note: [this.careplan.note],
			description: [this.careplan.description],
			NDISNumber: [this.careplan.NDISNumber, [Validators.pattern(this.NDISvalid), Validators.maxLength(9), Validators.minLength(9)]],
			NDISContact: [this.careplan.NDISContact],
			startDate: [this.careplan.startDate],
			dueDate: [this.careplan.dueDate],
			patientId: [participantDetails ? participantDetails.id : this.careplan.patientId],
			practitioner: [participantDetails && participantDetails.practitioner ? participantDetails.practitioner : this.careplan.keyPractitionerId],
			appointments: [''],

			// activity: this.careplanFB.array([
			// ]),
			familyGoals: this.careplanFB.array([
			]),
			fundedSupport: this.careplanFB.array([
			]),
			practitioners: this.careplanFB.array([
			])
		});
	}

	// add careplan goal
	addfamilyGoals() {
		let careplanFormArray = this.careplanForm.controls.familyGoals as FormArray;
		let arraylen = careplanFormArray.length;

		this.newCareplanFormGroup = this.careplanFB.group({
			title: [],
			support: [],
			strategy: [],
			shortTermGoals: this.careplanFB.array([
			]),
		});
		careplanFormArray.insert(arraylen, this.newCareplanFormGroup);
	}

	// add ShortTermG goal
	addShortTermGoals(i) {
		// let shortTermGoalFormArray = this.newCareplanFormGroup.controls.shortTermGoals as FormArray;
		// let arraylen = shortTermGoalFormArray.length;
		this.panelOpenState = true;
		let newShortTermFormGroup: FormGroup = this.careplanFB.group({
			id: [],
			title: [],
			description: [],
			outcome: [],
			outcomeDetail: [],
			strategy: []
		})

		let careplanFormArray = this.careplanForm.controls.familyGoals as FormArray;
		let _item = careplanFormArray.at(i);
		let _child = _item as FormGroup;
		var _arr = <FormArray> _child.get('shortTermGoals');
		_arr.push(newShortTermFormGroup);
	}

	// delete careplan goal
	deleteMyGoal(i) {
		let careplanFormArray = this.careplanForm.controls.familyGoals as FormArray;
		careplanFormArray.removeAt(i);
	}

	// delete careplan goal item
	deleteMyGoalItem(i, j) {
		let careplanFormArray = this.careplanForm.controls.familyGoals as FormArray;
		let _item = careplanFormArray.at(i);
		let _child = _item as FormGroup;
		let goal = _child.controls.shortTermGoals as FormArray;
		goal.removeAt(j);
	}

	// add careplan mybudget
	addmybudget() {
		let careplanFormArray = this.careplanForm.controls.fundedSupport as FormArray;
		let arraylen = careplanFormArray.length;

		let newCareplanFormGroup: FormGroup = this.careplanFB.group({
			fundAllocated: [],
			goal: [],
			budgetPlanId: [],
			fundCategoryId: []
		})
		careplanFormArray.insert(arraylen, newCareplanFormGroup);
	}

	// delete careplan mybudget
	deleteMyBudget(i) {
		let careplanFormArray = this.careplanForm.controls.fundedSupport as FormArray;
		careplanFormArray.removeAt(i);
	}

	// add careplan newPractitioner
	addpractitioners() {
		let careplanFormArray = this.careplanForm.controls.practitioners as FormArray;
		let arraylen = careplanFormArray.length;

		let newPractitionerFormGroup: FormGroup = this.careplanFB.group({
			id: [],
			name: []
		})

		careplanFormArray.insert(arraylen, newPractitionerFormGroup);
	}

	// delete careplan newPractitioner
	deletepractitioners(i) {
		let careplanFormArray = this.careplanForm.controls.practitioners as FormArray;
		careplanFormArray.removeAt(i);
	}


	goBackWithId() {
		const url = `/careplans/careplans`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshCareplan(isNew: boolean = false, id = 0) {
		// let url = this.router.url;
		// if (!isNew) {
		// 	this.router.navigate([url], { relativeTo: this.activatedRoute });
		// 	return;
		// }

		// url = `/careplans/careplans/edit/${id}`;
		// this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.careplan = Object.assign({}, this.oldCareplan);
		this.createForm("reset");
		this.hasFormErrors = false;
		this.careplanForm.markAsPristine();
		this.careplanForm.markAsUntouched();
		this.careplanForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.careplanForm.controls;
		if (!this.careplanForm.valid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedCareplan = this.prepareCareplan();

		if (editedCareplan.id) {
			this.updateCareplan(editedCareplan, withBack);
			return;
		}

		this.addCareplan(editedCareplan, withBack);
	}

	prepareCareplan(): Careplan {
		const controls = this.careplanForm.controls;
		const _careplan = new Careplan();
		_careplan.clear();
		_careplan.status = controls['status'].value;
		_careplan.intent = controls['intent'].value;
		_careplan.id = this.careplan.id;
		_careplan.title = controls['title'].value;
		_careplan.serviceBookingReference = controls['serviceBookingReference'].value;
		_careplan.startDate = controls['startDate'].value;
		_careplan.dueDate = controls['dueDate'].value;
		// _careplan.billingType = controls['billingType'].value;
		_careplan.keyPractitionerId = controls['practitioner'].value;
		_careplan.patientId = controls['patientId'].value;
		_careplan.familyGoals = controls['familyGoals'].value;
		_careplan.fundedSupport = controls['fundedSupport'].value;
		_careplan.practitioners = this.selectedTherapist;

		return _careplan;
	}

	prepareNotification() {
		const _notification = new Notification();
		_notification.clear();
		_notification.id = undefined;
		_notification.notify = "participant";
		_notification.type = "careplan";
		_notification.message = "Therapist has created a careplan";
		_notification.read = false;
		_notification.time = new Date();
		return _notification;
	}

	addCareplan(carePlan: Careplan, withBack: boolean = true) {
		this.store.dispatch(new CareplanOnServerCreated({ careplan: carePlan }));
		// this is for notifications
		// const preparedNotification = this.prepareNotification();
		// this.store.dispatch(new NotificationOnServerCreated({ notification: preparedNotification }));

		const addSubscription = this.store.pipe(select(selectLastCreatedCareplanId)).subscribe(newId => {
			if (newId) {
				const message = `New careplan successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				this.goBackWithId();
			}
		});
		this.subscriptions.push(addSubscription);
	}

	updateCareplan(carePlan: Careplan, withBack: boolean = false) {
		const updatedCareplan: Update<Careplan> = {
			id: carePlan.id,
			changes: carePlan
		};

		this.store.dispatch(new CareplanUpdated({
			partialCareplan: updatedCareplan,
			careplan: carePlan
		}));

		const message = `Careplan changes have been saved`;
		this.careplanForm.controls['patientId'].setValue(this.careplan.participant);
		this.participantSelected(this.careplan.participant);
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		if (withBack) {
			this.goBackWithId();
		} else {
			this.goBackWithId();
		}
	}

	getComponentTitle() {
		let result = 'Create Careplan';
		if (!this.careplan || !this.careplan.id) {
			return result;
		}

		result = `${this.careplan.title}`;
		return result;
	}

	getBillingType() {
		// this.store.dispatch(new GetBillingType({}));
		// this.store.pipe(select(selectBillingType)).subscribe(res => {
		// 	// response of billing type
		// 	if (res) {
		// 		console.log(res);
		// 		this.billingTypeList = res;
		// 	}
		// });
	}


	editCareplan(id) {
		this.router.navigate(['../careplans/edit', id], { relativeTo: this.activatedRoute });
	}

	/** Alect Close event */
	onAlertClose(any) {
		this.hasFormErrors = false;
	}

	participantSelected(value: any) {
		this.listBudgetByPatientId(value);
		this.currentParticipant = this.participantList.data.filter(participant => {
			return participant.id == value;
		});

		this.currentParticipant = this.currentParticipant[0];
	}

	// show hides reference number based on selection
	billingSelected(value) {
		if (value === 'AGENCY_MANAGED') {
			this.showHideBilling = true;
		} else {
			this.showHideBilling = false;
		}
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
		const obj = { id: event.option.value.id, text: event.option.value.text };
		this.selectedTherapist.push(obj);
		this.subPractitionerInput.nativeElement.value = '';
		this.subPractitionerCtrl.setValue(null);

		const index = this.subpractitionerList.findIndex(x => x.id === obj.id);
		this.subpractitionerList.splice(index, 1);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allsubPractitioners.filter(subPractitioner => subPractitioner.toLowerCase().indexOf(filterValue) === 0);
	}

	practitionerSelected(value) {
		//var _obj = this.practitionerList.filter(option => option.id == value);
		const index = this.subpractitionerList.findIndex(x => x.id === value);
		this.subpractitionerList.splice(index, 1);
	}

	loadParticipants() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new ParticipantsPageRequested({ page: queryParams }));
		this.store.pipe(select(selectParticipantsInStore)).subscribe(res => {
			if (res.data.length == 0) {
				return;
			}
			this.participantList = res;
			if (this.participantList && this.participantList.data) {
				this.participant = this.participantList.data.map(participant => {
					return {
						id: participant.id,
						fullName: participant.firstName + " " + participant.lastName,
						firstName: participant.firstName,
						lastName: participant.lastName
					};
				});
			}
		});
	}

	listBudgetByPatientId(participantId) {
		// this.store.dispatch(new GetBudgetByPatient({ participant_id: participantId }));
		// this.store.pipe(select(selectFundedBudgetbyPatient)).subscribe(res => {
		// 	// response of funded budget
		// 	if(res){
		// 		this.budgetPlan = res
		// 	}
		// })
	}

	loadPractitioner() {
		const queryParams = new QueryParamsModel(this.filterConfiguration());
		this.store.dispatch(new PractitionerPageRequested({ page: queryParams }));
		this.store.pipe(select(selectPractitionerInStore)).subscribe(res => {

			if (res.data.length == 0) {
				return;
			}

			this.practitionerList = res.data;
			this.subpractitionerList = Object.assign([], this.practitionerList);
		});
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	nextStep() {
		if (this.selectedTab <= 1) {
			this.selectedTab = this.selectedTab + 1;
			this.hideTab = false;
			if (this.selectedTab == 2) {
				this.hideTab = true;
			}
		} else {
			this.hideTab = true;
		}
	}

	back() {
		this.selectedTab = this.selectedTab - 1;
		if (this.selectedTab == -1) {
			const url = `/careplans/careplans`;
			// this.location.back()
			this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
		}
	}
}
