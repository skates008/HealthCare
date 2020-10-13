import {
	Component, OnInit, ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query, ViewChild
} from '@angular/core';

import { ProviderService } from './../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryParamsModel } from './../../../core/_base/crud';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { AuthService, CompanyService } from './../../../core/_services';
import { Update } from '@ngrx/entity';
import { CommunicationService } from '../communication.service';

@Component({
	selector: 'kt-provider-profile-service',
	templateUrl: './provider-profile-service.component.html',
	styleUrls: ['./provider-profile-service.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProviderProfileServiceComponent implements OnInit {
	@ViewChild('paginator', { static: true }) paginator: MatPaginator;
	@ViewChild('paginator2', { static: true }) paginator2: MatPaginator;

	loading$: Observable<boolean>;
	profile: ProviderService;
	private subscriptions: Subscription[] = [];
	profileForm: FormGroup;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	hasFormErrors: boolean = false;
	action: string = "service" ;

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
		this.profile = new ProviderService();
		this.createForm();

		this.companyService.getCompanyEditList().subscribe(res=>{
			if (res.data) {
				this.profile = res.data;
				this.profileForm.patchValue(this.profile);
				this.initProfile();
			}
		})
	}

	initProfile() {
		this.subheaderService.setTitle('Provider');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Service' }
		]);
	}

	createForm() {
		this.profileForm = this.profileFB.group({
			services: [''],
			registrationNumber: [''],
			medicareRegistrationNumber: ['']
		})
	}

	prepareProfile(): ProviderService {
		const controls = this.profileForm.controls;
		const _profile = new ProviderService();
		_profile.clear();
		_profile.services = controls['services'].value;
		_profile.registrationNumber = controls['registrationNumber'].value;
		_profile.medicareRegistrationNumber = controls['medicareRegistrationNumber'].value;
		_profile.action = this.action;
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

	updateProfile(_profile: ProviderService, withBack: boolean = false) {

		this.companyService.updateCompany(_profile).subscribe(res => {
			this.communicationService.emitChange();
			if(res.success){
				const message = `Service changes have been saved`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
			}
		})



		// const addSubscription = this.store.pipe(select(selectIsProfileCreateSuccess)).subscribe(success => {
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
}
