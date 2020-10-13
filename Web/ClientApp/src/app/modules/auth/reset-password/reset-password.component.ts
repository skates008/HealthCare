import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User, AuthNoticeService } from '../../../core/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'kt-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
	msg = 'Reset Password';
	resetForm: FormGroup;
	loading = false;
	code = '';
	userId = '';

	private unsubscribe: Subject<any>;

	/**
	 * Component constructor
	 *
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param router: Router
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private router: Router,
		private fb: FormBuilder,
		private translate: TranslateService,
		private authNoticeService: AuthNoticeService
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.initResetForm();
		this.activatedRoute.queryParams.subscribe(params => {
			this.code = params['code'];
			this.userId = params['userId'];
		});
	}

	/*
* On destroy
*/
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initResetForm() {
		this.resetForm = this.fb.group({
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			confirmPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			agree: [false, Validators.compose([Validators.required])]
		}, {
				validator: ConfirmPasswordValidator.MatchPassword
			});
	}

	submit() {
		const controls = this.resetForm.controls;

		// check form
		if (this.resetForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const user: User = new User();
		user.password = controls['password'].value;
		user.code = this.code;
		user.userId = this.userId;

		this.auth.resetPassword(user).subscribe(res => {
			if (res.success) {
				this.authNoticeService.setNotice(this.translate.instant('Thank you ! <br/>Please login'), 'success');
				this.router.navigateByUrl('/auth/login');
			} else {
				this.msg = 'Invalid Operation!';
			}
		});
	}

	/**
	   * Checking control validation
	   *
	   * @param controlName: string => Equals to formControlName
	   * @param validationType: string => Equals to valitors name
	   */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.resetForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
