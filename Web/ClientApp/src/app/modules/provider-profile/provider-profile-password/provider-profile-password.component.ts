import {
	Component, OnInit, ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query, ViewChild
} from '@angular/core';

import { 
	Profile,
	Password,
	selectIsProfileCreateSuccess, 
	AuthService} from './../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryParamsModel } from './../../../core/_base/crud';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubheaderService } from './../../../core/_base/layout';
import { Update } from '@ngrx/entity';
import { ConfirmPasswordValidator } from './confirm-password.validator';

@Component({
	selector: 'kt-provider-profile-password',
	templateUrl: './provider-profile-password.component.html',
	styleUrls: ['./provider-profile-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ProviderProfilePasswordComponent implements OnInit {
	@ViewChild('paginator', { static: true }) paginator: MatPaginator;
	@ViewChild('paginator2', { static: true }) paginator2: MatPaginator;

	loading$: Observable<boolean>;
	profile: Profile;
	loading = false;
	private subscriptions: Subscription[] = [];
	changePasswordForm: FormGroup;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	hasFormErrors: boolean = false;

	constructor(
		private store: Store<AppState>, 
		private router: Router, 
		private subheaderService: SubheaderService,
		private passwordFB: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private layoutUtilsService: LayoutUtilsService,
	) { }

	ngOnInit() {
		this.initPasswordForm();
		this.initProfile();
	}

	initProfile() {
		this.subheaderService.setTitle('Profile');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Change Password' }
		]);
	}

	initPasswordForm() {
		this.changePasswordForm = this.passwordFB.group({
			currentPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(100)
			])],
			NewPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(100)
			])],
			ConfirmPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(8),
				Validators.maxLength(100)
			])]
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		})
	}

	prepareProfile(): Password {
		const controls = this.changePasswordForm.controls;
		const _profile = new Password();
		_profile.clear();
		_profile.currentPassword = controls['currentPassword'].value;
		_profile.NewPassword = controls['NewPassword'].value;
		_profile.ConfirmPassword = controls['ConfirmPassword'].value;
		return _profile;
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loading = true;
		const controls = this.changePasswordForm.controls;

		if (!this.changePasswordForm.valid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}
		const editedProfile = this.prepareProfile();

		this.updateProfile(editedProfile);
		return;
	}

	updateProfile(_profile: Password) {
		this.auth.updatePassword(_profile).subscribe(res=>{
			if(res.success){
				const message = `Password changes have been updated`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
			}
		}, err =>{
			if(!err.error.success){
			this.loading = false;
			}
		})

		// const addSubscription = this.store.pipe(select(selectIsProfileCreateSuccess)).subscribe(success => {
		// 	if(!success){
		// 		this.loading = false;
		// 		return;
		// 	} else {
		// 		this.loading = false;
		// 		const message = `Profile changes have been saved`;
		// 		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		// 	}
		// });
		// this.subscriptions.push(addSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
		this.loading = false;
	}


	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.changePasswordForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
