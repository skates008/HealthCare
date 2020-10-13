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
	TherapyService,
	TherapyServiceUpdated,
	selectHasTherapyServicesInStore,
	selectTherapyServiceById,
	TherapyServiceOnServerCreated,
	selectLastCreatedTherapyServiceId,
	selectTherapyServicesActionLoading,
	ParticipantsPageRequested,
	selectParticipantsInStore,
	Notification,
	NotificationOnServerCreated
} from './../../../core/auth';
import { AppState } from './../../../core/reducers';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from './../../../core/_base/crud';

import { MatDatepicker, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TherapyServiceItem } from './../../../core/auth/_models/therapyService.model';


@Component({
	selector: 'kt-therapistPlans-edit',
	templateUrl: './therapistPlans-edit.component.html',
	styleUrls: ['./therapistPlans-edit.component.scss'],
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
export class TherapyServicesEditComponent implements OnInit, OnDestroy {

	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	@ViewChild('picker1', { static: true }) datePicker1: MatDatepicker<Date>;
	@ViewChild('picker2', { static: true }) datePicker2: MatDatepicker<Date>;
	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('stages', { static: true }) ele: ElementRef;

	displayedColumns: string[] = ['position', 'item', 'quantity', 'unitPrice', 'discount', 'taxRate', 'itemTotal', 'actions'];
	// dataSourceItems = ELEMENT_DATA;

	therapyService: TherapyService;
	therapyServiceId$: Observable<number>;
	oldTherapyService: TherapyService;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	therapyServiceForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	//bussiness dropdown items
	business = [{ id: 1, name: 'Business 1' }, { id: 2, name: 'Business 2' }, { id: 3, name: 'Business 3' }];
	//category dropdown items
	category = [{ id: 1, name: 'General' }, { id: 2, name: 'Therapy Services' }, { id: 3, name: 'Consultation' }];
	participant = [{ id: 1234, name: 'Dave Newman' }, { id: 1235, name: 'Sohal Rana' }, { id: 1236, name: 'Gustavo Sessa' }];
	TherapyServiceItems: TherapyServiceItem[] = [];
	appointmentDetails: object;
	participantList: any;
	resetButton: boolean = true;
	@Output() onItemAdd: EventEmitter<any> = new EventEmitter<any>();

	constructor(private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private router: Router,
		private therapyServiceFB: FormBuilder,
		private goalsFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			this.appointmentDetails = this.router.getCurrentNavigation().extras.state;
		}
	}

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectTherapyServicesActionLoading));
		this.therapyService = new TherapyService();
		this.loadParticipants();
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				this.store.pipe(select(selectTherapyServiceById(id))).subscribe(res => {
					if (res) {
						this.therapyService = res;
						this.oldTherapyService = Object.assign({}, this.therapyService);
						this.initTherapyService();

						this.therapyService.shortTermGoals.forEach(function (v, k) {
							this.addTherapyServiceItemNew(v);
							// const _formarr = this.therapyServiceForm.get("therapyServiceItem") as FormArray;
							// _formarr.push(this.therapyServiceFB.group(v));
						}.bind(this));
						this.resetButton = true;
					}

				});
			} else { 

				this.therapyService.clear();
				this.oldTherapyService = Object.assign({}, this.therapyService);
				this.initTherapyService();
				this.resetButton = false;
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	// get total calc. value
	getTotal(selectedItem, index) {

		if (this.therapyServiceForm && this.therapyServiceForm.controls && selectedItem && selectedItem.taxRate && selectedItem.unitPrice && selectedItem.quantity) {
			const total: number = selectedItem.quantity * selectedItem.unitPrice * (1 - ((selectedItem.discount || 0) / 100)) * (1 + (selectedItem.taxRate / 100));
			const values = this.therapyServiceForm.value.shortTermGoals;
			values.splice(index, 1, { ...selectedItem, itemTotal: total });
			this.therapyServiceForm.controls['shortTermGoals'].setValue(values, { emitEvent: false });
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initTherapyService() {
		this.createForm(this.appointmentDetails);
		if (!this.therapyService.id) {
			this.subheaderService.setTitle('Create TherapyService');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Create therapyService' }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit Therapist ');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Edit therapyService' }
		]);
	}

	createForm(appointmentDetails) {
		if (appointmentDetails && appointmentDetails.participant) {
			this.participant = appointmentDetails && appointmentDetails.participant;
		}

		this.therapyServiceForm = this.therapyServiceFB.group({
			title: [this.therapyService.title],
			providerName: [this.therapyService.providerName],
			providerAddress: [this.therapyService.providerAddress],
			providerEmail: [this.therapyService.providerEmail],
			providerNDIS: [this.therapyService.providerNDIS],

			participantName: [this.therapyService.participantName],
			participantAddress: [this.therapyService.participantAddress],
			participantEmail: [this.therapyService.participantEmail],
			participantNDIS: [this.therapyService.participantNDIS],

			issueDate: [this.therapyService.issueDate],
			startDate: [this.therapyService.startDate],
			endDate: [this.therapyService.endDate],
			careplanId: [this.therapyService.careplanId],

			planInchargeName: [this.therapyService.planInchargeName],
			planInchargeEmail: [this.therapyService.planInchargeEmail],
			planInchargePhone: [this.therapyService.planInchargePhone],

			furtherTherapy: [this.therapyService.furtherTherapy],
			familyGoal: [this.therapyService.familyGoal],

			shortTermGoals: this.therapyServiceFB.array([]),

			category: [this.therapyService.category],
			// therapyServiceTo: [this.therapyService.therapyServiceTo, Validators.required],
			// extraInfo: [this.therapyService.extraInfo, Validators.required],
			participant: [appointmentDetails && appointmentDetails.participant ? appointmentDetails.participant[0].id : [this.therapyService.participantName]],
			practitioner: appointmentDetails && appointmentDetails.practitioner ? appointmentDetails.practitioner : [this.therapyService.practitioner],
			appointments: [''],
			note: [this.therapyService.note],
			// therapyServiceItem: this.therapyServiceFB.array([])
		})

		if(appointmentDetails && appointmentDetails.shortTermGoals && appointmentDetails.shortTermGoals.length>0){
			for(let data of appointmentDetails.shortTermGoals || []){
				this.addTherapyServiceItemNew(data[0]);
			}
		}
	}


	// add therapyService Item
	addTherapyServiceItem() {
		let therapyServiceFormArray = this.therapyServiceForm.controls.shortTermGoals as FormArray;
		let arraylen = therapyServiceFormArray.length;

		let newTherapyServiceFormGroup: FormGroup = this.therapyServiceFB.group({
			name: [],
			goalDescription: [],
			goalOutCome: [],
			goalOutComeDetail: [],
			goalStrategy: [],
		})
		therapyServiceFormArray.insert(arraylen, newTherapyServiceFormGroup);
	}

	// add therapyService Item
	addgoalsItem() {
		let therapyServiceFormArray = this.therapyServiceForm.controls.shortTermGoals as FormArray;
		let arraylen = therapyServiceFormArray.length;

		let newTherapyServiceFormGroup: FormGroup = this.therapyServiceFB.group({
			goalDescription: [],
			goalOutCome: [],
			goalOutComeDetail: [],
			goalStrategy: [],
		})
		therapyServiceFormArray.insert(arraylen, newTherapyServiceFormGroup);
	}
	

	addTherapyServiceItemNew(data) {
		let therapyServiceFormArray = this.therapyServiceForm.controls.shortTermGoals as FormArray;
		let arraylen = therapyServiceFormArray.length;

		let newTherapyServiceFormGroup: FormGroup = this.therapyServiceFB.group({
			name: [data.name],
			goals: this.goalsFB.array([
				[data.goals]
			]),
		
			goalDescription: [data.goalDescription],
			goalOutCome: [ data.goalOutCome],
			goalOutComeDetail: [ data.goalOutComeDetail],
			goalStrategy: [data.goalStrategy],
		})
		therapyServiceFormArray.insert(arraylen, newTherapyServiceFormGroup);
	}

	// delete therapyService Item
	deleteItems(i) {
		let therapyServiceFormArray = this.therapyServiceForm.controls.shortTermGoals as FormArray;
		therapyServiceFormArray.removeAt(i);
	}


	goBackWithId() {
		const url = `/therapistPlans/therapistPlans`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshTherapyService(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/therapistPlans/therapistPlans/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.therapyService = Object.assign({}, this.oldTherapyService);
		this.createForm("reset");
		this.hasFormErrors = false;
		this.therapyServiceForm.markAsPristine();
		this.therapyServiceForm.markAsUntouched();
		this.therapyServiceForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.therapyServiceForm.controls;
		if (this.therapyServiceForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const editedTherapyService = this.prepareTherapyService();

		if (editedTherapyService.id > 0) {
			this.updateTherapyService(editedTherapyService, withBack);
			return;
		}

		this.addTherapyService(editedTherapyService, withBack);
	}



	prepareTherapyService(): TherapyService {
		const controls = this.therapyServiceForm.controls;
		const _therapyService = new TherapyService();
		_therapyService.clear();
		_therapyService.title = controls['title'].value;
		_therapyService.providerName = controls['providerName'].value;
		_therapyService.providerAddress = controls['providerAddress'].value;
		_therapyService.providerEmail = controls['providerEmail'].value;
		_therapyService.providerNDIS = controls['providerNDIS'].value;

		_therapyService.participantName = controls['participantName'].value;
		_therapyService.participantAddress = controls['participantAddress'].value;
		_therapyService.participantEmail = controls['participantEmail'].value;
		_therapyService.participantNDIS = controls['participantNDIS'].value;

		_therapyService.issueDate = controls['issueDate'].value;
		_therapyService.startDate = controls['startDate'].value;
		_therapyService.endDate = controls['endDate'].value;
		_therapyService.careplanId = controls['careplanId'].value;

		_therapyService.planInchargeName = controls['planInchargeName'].value;
		_therapyService.planInchargeEmail = controls['planInchargeEmail'].value;
		_therapyService.planInchargePhone = controls['planInchargePhone'].value;

		_therapyService.furtherTherapy = controls['furtherTherapy'].value;
		_therapyService.familyGoal = controls['familyGoal'].value;
		// _therapyService.therapyServiceTo = controls['therapyServiceTo'].value;
		_therapyService.id = this.therapyService.id;
		_therapyService.issueDate = controls['issueDate'].value;
		_therapyService.note = controls['note'].value;
		_therapyService.practitioner = controls['practitioner'].value;
		_therapyService.participantName = controls['participant'].value;
		_therapyService.shortTermGoals = controls['shortTermGoals'].value;
		return _therapyService;
	}


	addTherapyService(_therapyService: TherapyService, withBack: boolean = false) {
		this.store.dispatch(new TherapyServiceOnServerCreated({ therapyService: _therapyService }));

		const addSubscription = this.store.pipe(select(selectLastCreatedTherapyServiceId)).subscribe(newId => {
			const message = `New Therapy Service Summary successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			if (newId) {
				if (withBack) {
					this.goBackWithId();
				} else {
					this.refreshTherapyService(true, newId);
				}
			}
		});
		this.subscriptions.push(addSubscription);
	}

	updateTherapyService(_therapyService: TherapyService, withBack: boolean = false) {
		const updatedTherapyService: Update<TherapyService> = {
			id: _therapyService.id,
			changes: _therapyService
		};

		this.store.dispatch(new TherapyServiceUpdated({
			partialTherapyService: updatedTherapyService,
			therapyService: _therapyService
		}));

		const message = `Therapy Service Summary changes have been saved`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		if (withBack) {
			this.goBackWithId();
		} else {
			this.refreshTherapyService(false);
		}
	}

	getComponentTitle() {
		let result = 'Create Therapy Service Summary';
		if (!this.therapyService || !this.therapyService.id) {
			return result;
		}

		result = `Edit Therapy Service Summary #${this.therapyService.id}`;
		return result;
	}

	editTherapyService(id) {
		this.router.navigate(['../therapistPlans/edit', id], { relativeTo: this.activatedRoute });
	}

	/** Alect Close event */
	onAlertClose(any) {
		this.hasFormErrors = false;
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
			if (this.participantList && this.participantList.items) {
				this.participant = this.participantList.items.map(participant => {
					return {
						id: participant.id,
						fullName: participant.firstName + " " + participant.lastName,
						firstName: participant.firstName,
						lastName: participant.lastName
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
