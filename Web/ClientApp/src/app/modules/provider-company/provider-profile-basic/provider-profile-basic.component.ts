import {
	Component, OnInit, ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query, ViewChild
} from '@angular/core';

import { selectParticipantById, selectProfileEditPage, selectParticipantsActionLoading, MedicationsPageRequested, selectMedicationByParticipantId, MedicationDeleted, AllergyPageRequested, selectAllergiesByParticipantId, AllergyDeleted, BudgetPageRequested, selectBudgetByParticipantId, BudgetDeleted, MedicationDataSource, AllergyDataSource, ParticipantsPageRequested, ParticipantProfilePageRequested, selectParticipantsInStore, ProfileEditPageRequested, Profile, ProfileUpdated, selectIsProfileCreateSuccess, Address, ProviderBasic } from './../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { AuthService, CompanyService } from './../../../core/_services';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryParamsModel } from './../../../core/_base/crud';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { Update } from '@ngrx/entity';
import { CommunicationService } from '../communication.service';


@Component({
	selector: 'kt-provider-profile-basic',
	templateUrl: './provider-profile-basic.component.html',
	styleUrls: ['./provider-profile-basic.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProviderProfileBasicComponent implements OnInit {
	@ViewChild('paginator', { static: true }) paginator: MatPaginator;
	@ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
	addressSubject = new BehaviorSubject<Address>(new Address());

	loading$: Observable<boolean>;
	basic: ProviderBasic;
	private subscriptions: Subscription[] = [];
	profileForm: FormGroup;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	hasFormErrors: boolean = false;
	addressResult: {
		streetName, streetNumber, state, unit, city, postCode, address
	}

	action: string = "basic" ;

	constructor(
		private store: Store<AppState>,
		private router: Router,
		private subheaderService: SubheaderService,
		private profileFB: FormBuilder,
		private auth: AuthService,
		private companyService: CompanyService,
		private communicationService: CommunicationService,
		private activatedRoute: ActivatedRoute,
		private layoutUtilsService: LayoutUtilsService,
	) { }

	ngOnInit() {
		this.basic = new ProviderBasic();
		this.createForm();

		this.companyService.getCompanyEditList().subscribe(res=>{
			if (res.data) {
				this.basic = res.data;
				const address = this.basic.registeredCompanyAddress;
				this.profileForm.patchValue(this.basic);
				this.addressResult = {
					streetName: address.streetName,
					streetNumber: address.streetNumber,
					unit: address.unit,
					state: address.state,
					city: address.city,
					postCode: address.postCode,
					address: address.address
				}
				this.profileForm.controls['registeredCompanyAddress'].patchValue(this.addressResult);
				this.initProfile();
			}
		})
	}

		// this.store.dispatch(new ProfileEditPageRequested({}));
		// this.store.pipe(select(selectProfileEditPage)).subscribe(res => {
		// 	if(res){
		// 	this.profile = res;
		// 	this.profileForm.patchValue(this.profile);
		// 	this.initProfile();
		// 	}
		// })



	initProfile() {
		this.subheaderService.setTitle('Provider');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Basic' }
		]);
	}

	createForm() {
		this.profileForm = this.profileFB.group({
			name: ['', Validators.required],
			companyType: ['', Validators.required],
			tradingName: [''],
			abnNumber: ['', Validators.required],
			registeredCompanyAddress: ['']
		})

	}

	prepareProfile(): ProviderBasic {
		const controls = this.profileForm.controls;
		const _profile = new ProviderBasic();
		_profile.clear();
		_profile.name = controls['name'].value;
		_profile.companyType = controls['companyType'].value;
		_profile.tradingName = controls['tradingName'].value;
		_profile.abnNumber = controls['abnNumber'].value;
		_profile.action = this.action;
		// Address
		this.addressResult = controls['registeredCompanyAddress'].value;

		_profile.registeredCompanyAddress = {
			address:  this.addressResult.address,
			unit: this.addressResult.unit,
			state: this.addressResult.state,
			city: this.addressResult.city,
			postCode: this.addressResult.postCode,
			streetNumber: this.addressResult.streetNumber,
			streetName: this.addressResult.streetName
		}
		return _profile;
	}

	onSubmit(withBack: boolean = false) {
		debugger;
		this.hasFormErrors = false;
		const controls = this.profileForm.controls;
		if (!this.profileForm.valid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}

		const editedProfile = this.prepareProfile();
		this.updateProfile(editedProfile, withBack);
		return;
	}

	updateProfile(_profile: ProviderBasic, withBack: boolean = false) {
		this.companyService.updateCompany(_profile).subscribe(res => {
			if(res.success){
				this.communicationService.emitChange();
				const message = `Basic changes have been saved`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
			}
		})


		// const addSubscription = this.store.pipe(select(selectIsCompanyCreateSuccess)).subscribe(success => {
		// 	console.log('Status:', success);
		// 	if(!success){
		// 		return;
		// 	} else {
		// 		this.communicationService.emitChange()
		// 		const message = `Profile changes have been saved`;
		// 		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		// 	}
		// });
		// this.subscriptions.push(addSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	handleAddressChange(address) {
		this.profileForm.get('streetNumber').reset();
		this.profileForm.get('streetName').reset();
		this.profileForm.get('city').reset();
		this.profileForm.get('state').reset();
		this.profileForm.get('postCode').reset();
		this.profileForm.controls.formatted_address.setValue( address.formatted_address);
	   address.address_components.forEach(res=>{
			res.types.includes("street_number") ? this.profileForm.controls.streetNumber.setValue(res.long_name): "";
			res.types.includes("route") ? this.profileForm.controls.streetName.setValue(res.long_name): "";
			res.types.includes("administrative_area_level_2") ? this.profileForm.controls.city.setValue(res.long_name): "";
			res.types.includes("administrative_area_level_1") ? this.profileForm.controls.state.setValue(res.long_name): "";
			res.types.includes("postal_code") ? this.profileForm.controls.postCode.setValue(res.long_name):"";
	   })
	}
}
