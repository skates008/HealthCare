import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Output, EventEmitter} from '@angular/core';

import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

// import { selectUsersActionLoading, selectUserById, User } from 'src/app/core/auth';
// import { UseExistingWebDriver } from 'protractor/built/driverProviders';

import { Observable, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { DateTimeAdapter } from 'ng-pick-datetime';


// Services and Models
import {
	Time,
	TimeUpdated,
	BillableItemsForTimeRequested,
	TimeEntryDetailsByID,
	selectTimesInStore,
	selectBillableItemsInStore,
	selectTimeCreateSuccess,
} from './../../../core/auth';
import { AuthService, CareplanService } from './../../../core/_services';
import { AppState } from './../../../core/reducers';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';

import { MatDatepicker, MatDialog} from '@angular/material';


@Component({
	selector: 'kt-timeEntry-edit',
	templateUrl: './timeEntry-edit.component.html',
	styleUrls: ['./timeEntry-edit.component.scss'],
})
export class TimeEntryEditComponent implements OnInit, OnDestroy {

	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('stages', { static: true }) ele: ElementRef;

	time: Time;
	loading$: Observable<boolean>;
	timeForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	billableItem: any;
	billableItemDropDown: any;
	careplanDropdown: any;
	careplanId: string;
	participantDetails: any;
	hasNoCareplan: boolean = false;
	participantId: string;
	message;
	currentUnit: any;

	appointmentDetails: object;
	newTimeFormGroup: FormGroup;
	@Output() onItemAdd: EventEmitter<any> = new EventEmitter<any>();

	constructor(
		private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private router: Router,
		private timeFB: FormBuilder,
		private careplanService: CareplanService,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		dateTimeAdapter: DateTimeAdapter<any>) {
		dateTimeAdapter.setLocale('en-AU');
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			this.appointmentDetails = this.router.getCurrentNavigation().extras.state;
			this.participantDetails = this.router.getCurrentNavigation().extras.state.participant;
			this.participantId = this.router.getCurrentNavigation().extras.state.patientId;
		}
		if (this.participantDetails) {
		this.loadCareplanList(this.participantDetails.id);
		} else {
			this.loadCareplanList(this.participantId);
		}
	}

	ngOnInit() {
		this.timeForm = this.timeFB.group({
			name: ['', Validators.required],
			careplanId: ['', Validators.required],
			billableItems: this.timeFB.array([
			])
		});

		this.newTimeFormGroup = this.timeFB.group({
			StartTime: [],
			Id: [],
			Quantity: []
		});

		this.loadBillableItems();

		this.activatedRoute.params.subscribe(
			params => {
				const id = params["id"];
				if (id) {
					this.store.dispatch(new TimeEntryDetailsByID({ timeEntryId: id  }));
					this.store.pipe(select(selectTimesInStore)).subscribe(res => {
						if (res) {
							this.time = res.data[0];
							this.timeForm = this.timeFB.group({
							 				name: [this.time.name],
											careplanId: [this.time.careplanId],
							 				billableItems: this.timeFB.array([])
										 });
							this.loadCareplanList(this.time.participantId);
							this.initTime();
									} else {
										this.time.clear();
										this.initTime();
									}
					});
				}
			}
		);

		this.time = new Time();

	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	onExportCSV(){

	}

	initTime() {
		this.createForm(this.appointmentDetails);
		this.subheaderService.setTitle('Time Entry');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Edit time Entry' }
		]);
	}

	createForm(appointmentDetails) {
		this.timeForm = this.timeFB.group({
			name: [this.time.name, Validators.required],
			careplanId: [this.time.careplanId, Validators.required],
			billableItems: this.timeFB.array([

			])
		})

		this.time.billableItems.forEach(function(v) {
			//this.addTimeItemNew(v.billableItem);
			let _obj = { StartTime: v.startTime, Id: v.billableItem.id, Quantity: v.quantity, placeholder: 'Quantity'};
			const _formarr = this.timeForm.get("billableItems") as FormArray;
			_formarr.push(this.timeFB.group(_obj));
		}.bind(this));

		if(appointmentDetails && appointmentDetails.billableItem && appointmentDetails.billableItem.length>0){
			for(let data of appointmentDetails.billableItem || []){
				this.addTimeItemNew(data[0]);
			}
		}
	}

	addTimeItem() {
		let timeFormArray = this.timeForm.controls.billableItems as FormArray;
		let arraylen = timeFormArray.length;

		let newTimeFormGroup: FormGroup = this.timeFB.group({
			StartTime: [, Validators.required],
			Id: [, Validators.required],
			Quantity: [, Validators.required],
			placeholder: ['Quantity']
		})
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
		const url = `/times/timeEntry`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
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

		this.updateTime(editedTime);
		// this.addTime(editedTime);
	}

	prepareTime(): Time {
		const controls = this.timeForm.controls;
		const _time = new Time();
		_time.clear();
		_time.name = controls['name'].value;
		_time.billableItems = controls['billableItems'].value;
		_time.careplanId = controls['careplanId'].value;
		_time.id = this.time.id;
		return _time;
	}


	updateTime(_time: Time) {
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
			} else {
				const message = `Time Entry changes have been saved`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				this.goBackWithId();
			}
		});
		this.subscriptions.push(addSubscription);
	}


	billableSelected(index, value){
		var data =  this.billableItemDropDown.filter(function(unit) {
			return unit.id == value;
		});

		this.currentUnit = data[0].unit;
		let _arr = this.timeForm.controls.billableItems as FormArray;
		let _group = _arr.at(index) as FormGroup;
		_group.controls.placeholder = this.currentUnit;
	}

	getPlaceholder(value): string{
		var data =  this.billableItemDropDown.filter(function(unit) {
			return unit.id == value;
		});
		return data[0].unit;
	}


	getComponentTitle() {
		let result = 'Create Time Entry';
		if (!this.time || !this.time.id) {
			return result;
		}

		if(!this.participantDetails){
			result = `Edit Time Entry for ${this.time.patientName}`;
		} else {
			result = `Edit Time Entry for ${this.participantDetails.preferredName}`;
		}
		return result;
	}

	editTime(id) {
		this.router.navigate(['../timeEntry/edit', id], { relativeTo: this.activatedRoute });
	}

	/** Alect Close event */
	onAlertClose() {
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
	loadCareplanList(id){
		this.careplanService.findCareplansForTimeEntry(id).subscribe(res=>{
			this.careplanDropdown = res;
			if (this.careplanDropdown.length === 0) {
				this.hasNoCareplan = true;
			}
		});
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}
}
