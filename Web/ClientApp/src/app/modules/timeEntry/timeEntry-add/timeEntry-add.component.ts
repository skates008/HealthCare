import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Output, EventEmitter, Inject, Optional } from '@angular/core';

import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Select2OptionData } from 'ng2-select2';

// Services and Models
import {
	Time,
	TimeUpdated,
	TimeOnServerCreated,
	BillableItemsForTimeRequested,
	TimeEntryDetailsByID,
	selectTimesInStore,
	selectBillableItemsInStore,
	selectTimeCreateSuccess
} from './../../../core/auth';
import { AuthService, CareplanService } from './../../../core/_services';
import { AppState } from './../../../core/reducers';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';

import { MatDatepicker, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TimeItem } from './../../../core/auth/_models/time.model';
import { Location } from '@angular/common';
import { DateTimeAdapter } from 'ng-pick-datetime';


@Component({
	selector: 'kt-timeEntry-add',
	templateUrl: './timeEntry-add.component.html',
	styleUrls: ['./timeEntry-add.component.scss'],
	// providers: [
	// 	{ provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
	// 	{
	// 		provide: DateAdapter,
	// 		useClass: MomentDateAdapter,
	// 		deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
	// 	},
	// 	{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
	// ],
})
export class TimeEntryAddComponent implements OnInit, OnDestroy {

	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;

	time: Time;
	timeId$: Observable<number>;
	loading$: Observable<boolean>;
	timeForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	billableItem: any;
	participantName;
	billableItemDropDown: any;
	careplanDropdown: any;
	careplanId: string;
	participantDetails: any;
	hasNoCareplan: boolean = false;
	participantId: string;
	message: string;
	currentUnit: any;
	hasDefaultplaceholder: boolean = true;
	dialogOpenForTime: boolean = false;
	appointmentId: string;

	appointmentDetails: any;
	resetButton: boolean = true;
	billables: any;
	newTimeFormGroup: FormGroup;
	@Output() onItemAdd: EventEmitter<any> = new EventEmitter<any>();

	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private timeFB: FormBuilder,
		private auth: AuthService,
		private careplanService: CareplanService,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private _location: Location,
		dateTimeAdapter: DateTimeAdapter<any>,
		private dialog: MatDialog,
		// public dialogRef: MatDialogRef<TimeEntryAddComponent>,
		// @Inject(MAT_DIALOG_DATA) public data: any,
		@Optional() public dialogRef: MatDialogRef<TimeEntryAddComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private layoutConfigService: LayoutConfigService) {
		dateTimeAdapter.setLocale('en-AU');
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			// this.appointmentDetails = this.router.getCurrentNavigation().extras.state.appointmentDetails;
			this.participantDetails = this.router.getCurrentNavigation().extras.state.participant;
			this.participantId = this.router.getCurrentNavigation().extras.state.patientId;
		}

		this.timeForm = this.timeFB.group({
			name: ['', Validators.required],
			careplanId: ['', Validators.required],
			billableItems: this.timeFB.array([
				this.newTimeFormGroup = this.timeFB.group({
					StartTime: [],
					Id: [],
					Quantity: [],
					placeholder: ['Quantity']
				})
			])
		})
	}

	ngOnInit() {
		if (this.data && this.data.appointmentDetails) {
			this.dialogOpenForTime = true;
			this.loadCareplanList(this.data.appointmentDetails.patientId);
			this.participantName = this.data.appointmentDetails.patientName;
			this.appointmentId = this.data.appointmentDetails.id;
			this.getComponentTitle();
		}


		if (this.participantDetails) {
			this.loadCareplanList(this.participantDetails.id);
			this.participantName = this.participantDetails.preferredName;
			this.getComponentTitle();
		}

		if (this.data && this.data.participantDetails) {
			this.dialogOpenForTime = true;
			this.loadCareplanList(this.data.participantDetails.id);
			this.participantName = this.data.participantDetails.preferredName;
			this.getComponentTitle();
		}
		// this.timeForm.controls.billableItems[0].controls.placeholder='Quantity';

		this.loadBillableItems();

		this.activatedRoute.params.subscribe(
			params => {
				const id = params["id"];
				if (id) {
					this.store.dispatch(new TimeEntryDetailsByID({ timeEntryId: id }));
					this.store.pipe(select(selectTimesInStore)).subscribe(res => {
						if (res) {
							this.time = res.data[0];
							this.timeForm = this.timeFB.group({
								name: [this.time.name],
								careplanId: [this.time.careplanId],
								billableItems: this.timeFB.array([])
							})
							this.initTime();
							this.resetButton = true;
						} else {
							this.time.clear();
							this.initTime();
							this.resetButton = false;
						}

					})
				}
			}
		);

		// this.loading$ = this.store.pipe(select(selectTimesActionLoading));
		this.time = new Time();
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	onExportCSV() {

	}

	initTime() {
		this.createForm(this.appointmentDetails);
		this.subheaderService.setTitle('Create Time Entry');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Create time Entry' }
		]);
	}

	getComponentTitle() {
		let result = 'Create Time Entry';
		if (this.participantName) {
			result = `Create Time Entry for ${this.participantName}`;
			return result;
		}
	}

	createForm(appointmentDetails) {
		this.timeForm = this.timeFB.group({
			name: [this.time.name, Validators.required],
			careplanId: [this.time.careplanId, Validators.required],
			billableItems: this.timeFB.array([

			])
		})

		this.time.billableItems.forEach(function (v, k) {
			//this.addTimeItemNew(v.billableItem);
			let _obj = { StartTime: v.startTime, Id: v.billableItem.id, Quantity: v.quantity, placeholder: 'Quantity' };
			const _formarr = this.timeForm.get("billableItems") as FormArray;
			_formarr.push(this.timeFB.group(_obj));
		}.bind(this));

		if (appointmentDetails && appointmentDetails.billableItem && appointmentDetails.billableItem.length > 0) {
			for (let data of appointmentDetails.billableItem || []) {
				this.addTimeItemNew(data[0]);
			}
		}
	}

	// add time Name
	addTimeItem() {
		let timeFormArray = this.timeForm.controls.billableItems as FormArray;
		let arraylen = timeFormArray.length;

		var newTimeFormGroup: FormGroup = this.timeFB.group({
			StartTime: [, Validators.required],
			Id: [, Validators.required],
			Quantity: [, Validators.required],
			placeholder: ['Quantity']
		});

		timeFormArray.insert(arraylen, newTimeFormGroup);
	}

	addTimeItemNew(data) {
		let timeFormArray = this.timeForm.controls.billableItems as FormArray;
		let arraylen = timeFormArray.length;

		let newTimeFormGroup: FormGroup = this.timeFB.group({
			StartTime: [],
			Id: [data.Id],
			Quantity: [],
			placeholder: ['Quantity']
		})
		timeFormArray.insert(arraylen, newTimeFormGroup);
	}

	// delete time Name
	deleteItems(i) {
		let timeFormArray = this.timeForm.controls.billableItems as FormArray;
		timeFormArray.removeAt(i);
	}

	goBackWithId() {
		const url = `/timeEntry/timeEntry`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.createForm("reset");
		this.hasFormErrors = false;
		this.timeForm.markAsPristine();
		this.timeForm.markAsUntouched();
		this.timeForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;

		const controls = this.timeForm.controls;
		if (!this.timeForm.valid) {

			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedTime = this.prepareTime();

		if (editedTime.id) {
			this.updateTime(editedTime, withBack);
			return;
		}

		this.addTime(editedTime);
	}

	prepareTime(): Time {
		const controls = this.timeForm.controls;
		const _time = new Time();
		_time.clear();
		_time.name = controls['name'].value;
		_time.billableItems = controls['billableItems'].value;
		_time.careplanId = controls['careplanId'].value;
		_time.id = this.time.id;
		if (this.appointmentId) {
			_time.appointmentId = this.appointmentId;
		}
		return _time;
	}

	addTime(_time: Time, withBack: boolean = true) {
		this.store.dispatch(new TimeOnServerCreated({ time: _time }));
		const addSubscription = this.store.pipe(select(selectTimeCreateSuccess)).subscribe(success => {
			if (!success) {
				this.hasFormErrors = true;
				this.message = 'Billable fields can not be empty';
				return;
			} else if(this.data.participantDetails || this.data.appointmentDetails){
					this.dialogRef.close({
						dialogTimeEntry: true
			});
			}else{
				// this.hasFormErrors = false;
				this.back();
			}
			this.hasFormErrors = false;
			const message = `New time successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			// this.dialog.close();
		});

		this.subscriptions.push(addSubscription);
	}

	updateTime(_time: Time, withBack: boolean = false) {
		const updatedTime: Update<Time> = {
			id: _time.id,
			changes: _time
		};

		this.store.dispatch(new TimeUpdated({
			partialTime: updatedTime,
			time: _time
		}));

		const addSubscription = this.store.pipe(select(selectTimeCreateSuccess)).subscribe(success => {
			if (!success) {
				return;
			}

			const message = `Time changes have been saved`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);

		});
	}

	billableSelected(index, value) {
		this.hasDefaultplaceholder = false;
		var data = this.billableItemDropDown.filter(function (unit) {
			return unit.id == value;
		});

		this.currentUnit = data[0].unit;
		let _arr = this.timeForm.controls.billableItems as FormArray;
		let _group = _arr.at(index) as FormGroup;
		_group.controls.placeholder = this.currentUnit;
	}


	editTime(id) {
		this.router.navigate(['../timeEntry/edit', id], { relativeTo: this.activatedRoute });
	}

	/** Alect Close event */
	onAlertClose(any) {
		this.hasFormErrors = false;
		this.hasNoCareplan = false;
	}

	loadBillableItems() {
		this.store.dispatch(new BillableItemsForTimeRequested());
		this.store.pipe(select(selectBillableItemsInStore)).subscribe(res => {
			this.billableItemDropDown = res.data;
		});
	}

	// new api
	loadCareplanList(id) {
		this.careplanService.findCareplansForTimeEntry(id).subscribe(res => {
			const value = res;
			this.careplanDropdown = value;
			if (this.careplanDropdown.length == 0) {
				this.hasNoCareplan = true;
			}
		})
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	back() {
		this._location.back();
	}
}
