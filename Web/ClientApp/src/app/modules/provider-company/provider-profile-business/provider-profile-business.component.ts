import {
	Component, OnInit, ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query, ViewChild
} from '@angular/core';

import { selectParticipantById, ProviderBusiness, selectProfileEditPage, selectParticipantsActionLoading, MedicationsPageRequested, selectMedicationByParticipantId, MedicationDeleted, AllergyPageRequested, selectAllergiesByParticipantId, AllergyDeleted, BudgetPageRequested, selectBudgetByParticipantId, BudgetDeleted, MedicationDataSource, AllergyDataSource, ParticipantsPageRequested, ParticipantProfilePageRequested, selectParticipantsInStore, ProfileEditPageRequested, Profile, ProfileUpdated, selectIsProfileCreateSuccess } from './../../../core/auth';
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
	selector: 'kt-provider-profile-business',
	templateUrl: './provider-profile-business.component.html',
	styleUrls: ['./provider-profile-business.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProviderProfileBusinessComponent implements OnInit {
	@ViewChild('paginator', { static: true }) paginator: MatPaginator;
	@ViewChild('paginator2', { static: true }) paginator2: MatPaginator;

	loading$: Observable<boolean>;
	profile: ProviderBusiness;
	private subscriptions: Subscription[] = [];
	profileForm: FormGroup;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	hasFormErrors: boolean = false;
	addressResult: {
		streetName, streetNumber, state, unit, city, postCode, formatted_address
   }

   action: string = "business" ;

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
		this.profile = new ProviderBusiness();
		this.createForm();

		this.companyService.getCompanyEditList().subscribe(res=>{
			if (res) {
			this.profile = res.data;
			const address = this.profile.businessAddress;
			this.profileForm.patchValue(this.profile);
			this.addressResult = {
				streetName: address.streetName,
				streetNumber: address.streetNumber,
				unit: address.unit,
				state: address.state,
				city: address.city,
				postCode: address.postCode,
				formatted_address: address.address
			}
			this.profileForm.controls['address'].patchValue(this.addressResult);
			this.initProfile();
			}
		})
	}

	initProfile() {
		this.subheaderService.setTitle('Provider');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Business' }
		]);
	}

	createForm() {
		this.profileForm = this.profileFB.group({
			businessEmail: ['', Validators.required],
			businessWebSite: ['', Validators.required],
			phoneNumber: ['', Validators.required],
			address: ['']
		})
	}

	prepareProfile(): ProviderBusiness {
		const controls = this.profileForm.controls;
		const _profile = new ProviderBusiness();
		_profile.clear();
		_profile.businessEmail = controls['businessEmail'].value;
		_profile.phoneNumber = controls['phoneNumber'].value;
		_profile.businessWebSite = controls['businessWebSite'].value;
		_profile.action = this.action;
		// Address
		this.addressResult = controls['address'].value;

			_profile.businessAddress = {
				address:  this.addressResult.formatted_address,
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

	updateProfile(_profile: ProviderBusiness, withBack: boolean = false) {
		this.companyService.updateCompany(_profile).subscribe(res => {
			if(res.success){
				this.communicationService.emitChange();
				const message = `Business changes have been saved`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
			}
		})
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}
}
