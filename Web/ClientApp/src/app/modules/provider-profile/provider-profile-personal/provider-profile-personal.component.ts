import {
	Component, OnInit, ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query, ViewChild
} from '@angular/core';

import { selectParticipantById, selectProfileEditPage, selectParticipantsActionLoading, MedicationsPageRequested, selectMedicationByParticipantId, MedicationDeleted, AllergyPageRequested, selectAllergiesByParticipantId, AllergyDeleted, BudgetPageRequested, selectBudgetByParticipantId, BudgetDeleted, MedicationDataSource, AllergyDataSource, ParticipantsPageRequested, ParticipantProfilePageRequested, selectParticipantsInStore, ProfileEditPageRequested, Profile, ProfileUpdated, selectIsProfileCreateSuccess, AuthService } from './../../../core/auth';
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
import { Update } from '@ngrx/entity';
import { CommunicationService } from '../communication.service';


@Component({
	selector: 'kt-provider-profile-personal',
	templateUrl: './provider-profile-personal.component.html',
	styleUrls: ['./provider-profile-personal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProviderProfilePersonalComponent implements OnInit {
	@ViewChild('paginator', { static: true }) paginator: MatPaginator;
	@ViewChild('paginator2', { static: true }) paginator2: MatPaginator;

	loading$: Observable<boolean>;
	profile: Profile;
	private subscriptions: Subscription[] = [];
	profileForm: FormGroup;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	hasFormErrors: boolean = false;

	constructor(
		private store: Store<AppState>, 
		private router: Router, 
		private subheaderService: SubheaderService,
		private profileFB: FormBuilder,
		private auth: AuthService,
		private communicationService: CommunicationService,
		private activatedRoute: ActivatedRoute,
		private layoutUtilsService: LayoutUtilsService,
	) { }

	ngOnInit() {
		this.profile = new Profile();
		this.createForm();

		this.store.dispatch(new ProfileEditPageRequested({}));
		this.store.pipe(select(selectProfileEditPage)).subscribe(res => {
			if(res){
			this.profile = res;
			this.profileForm.patchValue(this.profile);
			this.initProfile();
			}
		})
	}

	initProfile() {
		this.subheaderService.setTitle('Profile');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Personal' }
		]);
	}

	createForm() {
		this.profileForm = this.profileFB.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			position: [''],
			phoneNumber: ['', Validators.required]
		})
	}

	prepareProfile(): Profile {
		const controls = this.profileForm.controls;
		const _profile = new Profile();
		_profile.clear();
		_profile.firstName = controls['firstName'].value;
		_profile.lastName = controls['lastName'].value;
		_profile.position = controls['position'].value;
		_profile.phoneNumber = controls['phoneNumber'].value;
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

	updateProfile(_profile: Profile, withBack: boolean = false) {
		// const updatedProfile: Update<Profile> = {
		// 	id: _profile.id,
		// 	changes: _profile
		// };

		// this.store.dispatch(new ProfileUpdated({
		// 	profile: _profile
		// }));

		this.auth.updateProfile(_profile).subscribe(res => {
			if(res.success){
				this.communicationService.emitChange();
				const message = `Basic changes have been saved`;
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
