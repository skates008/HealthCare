// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
// Auth
import {
	AuthService,
 } from './../../../core/_services';
import {
	Login,
	UserUpdated,
	User,
	SettingPageRequested,
	selectQueryResultSetting
} from './../../../core/auth/index';
import { AuthNoticeService } from './../../../core/auth/auth-notice/auth-notice.service';
import { Update } from '@ngrx/entity';
import { UserService } from './../../../core/_services';
import { isError } from 'util';
import { QueryParamsModel } from './../../../core/_base/crud';




/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
	EMAIL: 'admin@demo.com',
	PASSWORD: 'demo'
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	styleUrls: ['../auth.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private userService: UserService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			// this.returnUrl = params['returnUrl'] || '/';
			this.returnUrl = '/';
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Enter your
			<strong>Email</strong> and
			<strong>Password</strong> to continue.`;
			this.authNoticeService.setNotice(initialNotice, 'info');
		}

		this.loginForm = this.fb.group({
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		this.loading = true;
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		const authData = {
			email: controls['email'].value,
			password: controls['password'].value
		};
		this.auth
			.login(authData.email, authData.password)
			.subscribe
			(response => {
				if (response.success) {
					localStorage.setItem("user_data", JSON.stringify({ user_details: response.data }));
					this.store.dispatch(new Login({ authToken: response.data.accessToken }));
					if (response.lastLoggedIn == null) {
						const updatedUser: Update<User> = {
							id: response.data.loginInfo.userId,
							changes: response.data
						};

						setTimeout(() => {
							switch (response.data.loginInfo.role) {
								case 'Owner':
								case 'Manager':
									if (!response.data.loginInfo.isRegistrationComplete) {
										this.router.navigateByUrl(this.returnUrl + 'welcomeProvider');
									} else {
										this.router.navigate([this.returnUrl + 'provider-dashboard']);
									}
									break;

								case 'User':
									if (!response.data.loginInfo.isRegistrationComplete) {
										this.router.navigateByUrl(this.returnUrl + 'welcomeTherapist');
									} else {
										this.router.navigate([this.returnUrl + 'therapist-dashboard']);
									}
									break;

								case 'Client':
									if (!response.data.loginInfo.isRegistrationComplete) {
										this.router.navigateByUrl(this.returnUrl + 'welcome');
									} else {
										this.router.navigateByUrl(this.returnUrl + 'dashboard');
									}
									break;
								default:
									this.router.navigateByUrl('error/403');
									break;
							}
							response.lastLoggedIn = new Date();
							//this.store.dispatch(new UserUpdated( { partialUser: updatedUser, user: user}));
							this.userService.updateUser(response);
						}, 1000);

					} else {
						this.router.navigateByUrl(this.returnUrl); // Main page
					}
				} else {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
				}
			}, err => {
				if (!err.error.success) {
					this.loading = false;
					this.cdr.markForCheck();
				}
			})
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
