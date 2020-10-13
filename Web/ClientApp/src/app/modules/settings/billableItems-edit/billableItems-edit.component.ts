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
	BillableItem,
	BillableItemUpdated,
	BillableItemOnServerCreated,
	selectLastCreatedBillableItemId,
	selectBillableItemsActionLoading,
	Notification,
	GetBillableItemById,
	selectBillableItemsInStore
} from './../../../core/auth';
import { AppState } from './../../../core/reducers';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';

import { MatDatepicker, MatDialog } from '@angular/material';

import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { BillableItemItem } from './../../../core/auth/_models/billableItem.model';
import { Location } from '@angular/common';


@Component({
	selector: 'kt-billableItems-edit',
	templateUrl: './billableItems-edit.component.html',
	styleUrls: ['./billableItems-edit.component.scss'],
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
export class BillableItemsEditComponent implements OnInit, OnDestroy {

	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	showBillableFields: boolean = false;

	billableItem: BillableItem;
	billableItemId$: Observable<number>;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	billableItemForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	NDISvalid = "";
	
	BillableItemItems: BillableItemItem[] = [];
	appointmentDetails: object;
	resetButton: boolean = true;
	@Output() onItemAdd: EventEmitter<any> = new EventEmitter<any>();

	constructor(private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private router: Router,
		private billableItemFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private _location: Location,
		private layoutConfigService: LayoutConfigService) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			this.appointmentDetails = this.router.getCurrentNavigation().extras.state;
		}
	}

	ngOnInit() {
		this.billableItemForm = this.billableItemFB.group({
			isBillable: [''],
			name: [''],
			price: [''],
			unit: [''],
			ndisNumber: [''],
			gstCode: [''],
			description: [''],
		})
		this.loading$ = this.store.pipe(select(selectBillableItemsActionLoading));
		this.billableItem = new BillableItem();
		this.billableItem
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id) {
				this.store.dispatch(new GetBillableItemById({ id: id }));
				this.store.pipe(select(selectBillableItemsInStore)).subscribe(res => {
					if (res) {
						this.billableItem = res.data[0];
						this.showBillableFields = this.billableItem.isBillable;
						this.initBillableItem();
					}
				});
			} else {
				this.billableItem.clear();
				this.initBillableItem();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initBillableItem() {
		this.createForm();
		if (!this.billableItem.id) {
			this.subheaderService.setTitle('New Billable Item');
			this.subheaderService.setBreadcrumbs([
				//{ title: 'Create Billable Item' }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit Billable Item');
		this.subheaderService.setBreadcrumbs([
		//	{ title: 'Edit Billable Item' }
		]);
	}

	createForm() {
		this.billableItemForm = this.billableItemFB.group({
			isBillable: [this.billableItem.isBillable, Validators.required],
			name: [this.billableItem.name, Validators.required],
			price: [this.billableItem.price],
			unit: [this.billableItem.unit],
			ndisNumber: [this.billableItem.ndisNumber],
			gstCode: [this.billableItem.gstCode],
			description: [this.billableItem.description],
		});
	}

	goBackWithId() {
		const url = `settings/billableItems`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.billableItemForm.controls;
		if (this.billableItemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const editedBillableItem = this.prepareBillableItem();

		if (editedBillableItem.id) {
			this.updateBillableItem(editedBillableItem, withBack);
			return;
		}

		this.addBillableItem(editedBillableItem, withBack);
	}

	prepareBillableItem(): BillableItem {
		const controls = this.billableItemForm.controls;
		const _billableItem = new BillableItem();
		_billableItem.clear();
		_billableItem.isBillable = controls['isBillable'].value;
		_billableItem.name = controls['name'].value;
		_billableItem.price= Number(controls['price'].value);
		_billableItem.unit= controls['unit'].value;
		_billableItem.ndisNumber= controls['ndisNumber'].value;
		_billableItem.gstCode= controls['gstCode'].value;
		_billableItem.description= controls['description'].value;
		_billableItem.id = this.billableItem.id;
		return _billableItem;
	}

	addBillableItem(_billableItem: BillableItem, withBack: boolean = false) {
		this.store.dispatch(new BillableItemOnServerCreated({ billableItem: _billableItem }));
		const addSubscription = this.store.pipe(select(selectLastCreatedBillableItemId)).subscribe(newId => {
			if (newId) {
				const message = `New billableItem successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
					this.goBackWithId();

			}
		});
		this.subscriptions.push(addSubscription);
	}

	updateBillableItem(_billableItem: BillableItem, withBack: boolean = false) {
		const updatedBillableItem: Update<BillableItem> = {
			id: _billableItem.id,
			changes: _billableItem
		};

		this.store.dispatch(new BillableItemUpdated({
			partialBillableItem: updatedBillableItem,
			billableItem: _billableItem
		}));

		const addSubscription = this.store.pipe(select(selectLastCreatedBillableItemId)).subscribe(newId => {
			if (newId) {	
			    const message = `Billable item changes have been saved`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				this.goBackWithId();
			}
		});
		this.subscriptions.push(addSubscription);
	}

	getComponentTitle() {
		let result = 'New Billable Item';
		if (!this.billableItem || !this.billableItem.id) {
			return result;
		}

		result = `${this.billableItem.name}`;
		return result;
	}

	/** Alect Close event */
	onAlertClose(any) {
		this.hasFormErrors = false;
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	isBillableSelected(index, value) {
		this.showBillableFields = value;
	}
	
	back(){
			this._location.back();
	}

}
