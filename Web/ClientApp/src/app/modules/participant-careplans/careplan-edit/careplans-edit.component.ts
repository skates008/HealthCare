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
	selectParticipantsInStore,
	selectBudgetByParticipantId,
	BudgetUpdated,
	Budget,
	BudgetPageRequested,
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
	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('stages', { static: true }) ele: ElementRef;

	careplan: Careplan;
	careplanId$: Observable<number>;
	oldCareplan: Careplan;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	careplanForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	//bussiness dropdown items
	category = [{ id: 1, name: 'category 1' }, { id: 2, name: 'category 2' }, { id: 3, name: 'category 3' }];
	participant = [{ id: 1234, name: 'Dave Newman' }, { id: 1235, name: 'Sohal Rana' }, { id: 1236, name: 'Gustavo Sessa' }];
	appointmentDetails: object;
	participantList: any;
	@Output() onItemAdd: EventEmitter<any> = new EventEmitter<any>();
	budgetData: any;
	calculatedBudget: any;
	resetButton: boolean = false;


	constructor(private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private router: Router,
		private careplanFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			this.appointmentDetails = this.router.getCurrentNavigation().extras.state;
		}
	}

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectCareplansActionLoading));
		this.careplan = new Careplan();
		// this.loadParticipants();


		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				this.store.pipe(select(selectCareplanById(id))).subscribe(res => {
					if (res) {
						this.careplan = res;
						this.oldCareplan = Object.assign({}, this.careplan);
						this.initCareplan();

						// this.careplan.activity.forEach(function (v, k) {
						// 	const _formarr = this.careplanForm.get("activity") as FormArray;
						// 	_formarr.push(this.careplanFB.group(v));
						// }.bind(this));

						this.resetButton = true;
					}

				});
			} else {
				this.careplan.clear();
				this.oldCareplan = Object.assign({}, this.careplan);
				this.initCareplan();
				this.resetButton = false;
				this.store.pipe(select(selectBudgetByParticipantId(1234))).subscribe(res => {
					if (res) {
						this.budgetData = res;
						for (let data of res) {
							this.addItem(data);
						}
					}
				});
			}

		});

		this.subscriptions.push(routeSubscription);


	}



	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initCareplan() {
		this.createForm(this.appointmentDetails);
		if (!this.careplan.id) {
			this.subheaderService.setTitle('Create Careplan');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Create careplan', page: `/careplan/careplans/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit Careplan');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Edit careplan', page: `/careplan/careplans/edit`, queryParams: { id: this.careplan.id } }
		]);
	}

	createForm(appointmentDetails) {
		if (appointmentDetails && appointmentDetails.participant) {
			this.participant = appointmentDetails && appointmentDetails.participant;
		}
		// const participantId = JSON.parse(localStorage.getItem('user_data')).user_id;
		const participantId = 1234;

		this.careplanForm = this.careplanFB.group({
			created: [new Date()],
			status: [this.careplan.status],
			title: [this.careplan.title],
			peroid: [new Date()],
			address: [this.careplan.address],
			goal: [this.careplan.goal],
			frequency: [this.careplan.frequency],
			budget: [this.careplan.budget],
			intent: [this.careplan.intent],
			category: [this.careplan.category],
			note: [this.careplan.note],
			description: [this.careplan.description],
			participant: [participantId],
			practitioner: appointmentDetails && appointmentDetails.practitioner ? appointmentDetails.practitioner : [this.careplan.practitioner],
			appointments: [''],
			activity: this.careplanFB.array([
			]),
			deductBudgetArr: this.careplanFB.array([])
		});
	}


	// add careplan Item
	addactivity() {
		let careplanFormArray = this.careplanForm.controls.activity as FormArray;
		let arraylen = careplanFormArray.length;

		let newCareplanFormGroup: FormGroup = this.careplanFB.group({
			outcomeCodableConcept: [],
			progress: [],
			goalActivity: [],
			description: [],
			budgetActivity: []
		})

		careplanFormArray.insert(arraylen, newCareplanFormGroup);
	}

	// delete careplan Item
	deleteItems(i) {
		let careplanFormArray = this.careplanForm.controls.activity as FormArray;
		careplanFormArray.removeAt(i);
	}

	createItem(data): FormGroup {
		return this.careplanFB.group({
			remainingBudget: data.remainingBudget,
			id: data.id,
			deductedValue: '',
			participant_id: data.participant_id,
			totalBudget: data.totalBudget,
			sourceOfBudget: data.sourceOfBudget,
			startDate: data.startDate,
			endDate: data.endDate
		});
	}

	addItem(data): void {
		const deductBudgetArr = this.careplanForm.get('deductBudgetArr') as FormArray;
		deductBudgetArr.push(this.createItem(data));
	}

	goBackWithId() {
		const url = `/participant-careplan/careplans`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshCareplan(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/participant-careplan/careplans/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
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
		if (this.careplanForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const editedCareplan = this.prepareCareplan();
		if (editedCareplan.id > 0) {
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
		_careplan.peroid = controls['peroid'].value;
		_careplan.address = controls['address'].value;
		_careplan.goal = controls['goal'].value;
		_careplan.frequency = controls['frequency'].value;
		_careplan.budget = controls['budget'].value;
		_careplan.note = controls['note'].value;
		_careplan.description = controls['description'].value;
		_careplan.created = controls['created'].value;
		// _careplan.practitioner = controls['practitioner'].value;
		_careplan.deductBudgetArr = controls['deductBudgetArr'].value;
		_careplan.participant = controls['participant'].value;
		// _careplan.activity = controls['activity'].value;
		return _careplan;
	}

	prepareNotification() {
		// console.log("participant data", this.appointment.participant.firstName);
		// this.participant = this.invoice.participant;
		const _notification = new Notification();
		_notification.clear();
		_notification.id = undefined;
		_notification.notify = "therapist";
		_notification.type = "careplan";
		_notification.message = "Participant has created a careplan";
		_notification.read = false;
		_notification.time = new Date();
		return _notification;
	  }

	addCareplan(_careplan: Careplan, withBack: boolean = false) {
		this.store.dispatch(new CareplanOnServerCreated({ careplan: _careplan }));
		// this is for notifications
		const preparedNotification = this.prepareNotification();
		this.store.dispatch(new NotificationOnServerCreated({ notification: preparedNotification }));

		this.updateBudget(_careplan);
		const addSubscription = this.store.pipe(select(selectLastCreatedCareplanId)).subscribe(newId => {
			const message = `New careplan successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			if (newId) {
				if (withBack) {
					this.goBackWithId();
				} else {
					this.refreshCareplan(true, newId);
				}
			}
		});
		this.subscriptions.push(addSubscription);
	}

	updateBudget(_careplan) {
		const updatedBudget = [];
		_careplan.deductBudgetArr.map(res => {
			this.calculatedBudget =
			{
				id: res.id,
				participant_id: res.participant_id,
				totalBudget: res.totalBudget,
				remainingBudget: res.remainingBudget - res.deductedValue,
				sourceOfBudget: res.sourceOfBudget,
				startDate: res.startDate,
				endDate: res.endDate

			}
			updatedBudget.push(this.calculatedBudget);
		});
		this.store.dispatch(new BudgetUpdated({ updateBudget: updatedBudget, }));

	}

	updateCareplan(_careplan: Careplan, withBack: boolean = false) {
		const updatedCareplan: Update<Careplan> = {
			id: _careplan.id,
			changes: _careplan
		};

		this.store.dispatch(new CareplanUpdated({
			partialCareplan: updatedCareplan,
			careplan: _careplan
		}));

		const message = `Careplan changes have been saved`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		if (withBack) {
			this.goBackWithId();
		} else {
			this.refreshCareplan(false);
		}
	}

	getComponentTitle() {
		let result = 'Create Careplan';
		if (!this.careplan || !this.careplan.id) {
			return result;
		}

		result = `Edit Careplan #${this.careplan.id}`;
		return result;
	}

	editCareplan(id) {
		this.router.navigate(['../careplans/edit', id], { relativeTo: this.activatedRoute });
	}

	/** Alect Close event */
	onAlertClose(any) {
		this.hasFormErrors = false;
	}

	// loadParticipants() {
	// 	let queryParams = new QueryParamsModel(
	// 		this.filterConfiguration(),
	// 	);
	// 	this.store.dispatch(new ParticipantsPageRequested({ page: queryParams }));
	// 	this.store.pipe(select(selectParticipantsInStore)).subscribe(res => {
	// 		if (res.items.length == 0) {
	// 			return;
	// 		}
	// 		this.participantList = res;
	// 		if (this.participantList && this.participantList.items) {
	// 			this.participant = this.participantList.items.map(participant => {
	// 				return {
	// 					id: participant.id,
	// 					fullName: participant.firstName + " " + participant.lastName,
	// 					firstName: participant.firstName,
	// 					lastName: participant.lastName
	// 				};
	// 			})
	// 		}

	// 	})
	// }

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

}
