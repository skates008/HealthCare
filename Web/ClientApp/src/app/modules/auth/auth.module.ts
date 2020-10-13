// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
// Material
import {
	MatButtonModule,
	MatCheckboxModule,
	MatFormFieldModule,
	MatInputModule } from '@angular/material';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterProviderComponent } from './register-provider/register-provider.component';
import { RegisterParticipantComponent } from './register-participant/register-participant.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
// Auth
import { AuthEffects, AuthGuard, authReducer, AuthService, settingsReducer, SettingEffects } from '../../core/auth';
import { RegisterTherapistComponent } from './register-therapist/register-therapist.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full'
			},
			{
				path: 'login',
				component: LoginComponent,
				data: { returnUrl: window.location.pathname }
			},
			{
				path: 'provider/register',
				component: RegisterProviderComponent
			},
			{
				path: 'provider/therapist',
				component: RegisterTherapistComponent
			},
			{
				path: 'participant/register',
				component: RegisterParticipantComponent
			},
			{
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			},
			{
				path: 'confirmemail',
				component: ConfirmEmailComponent,
			},
			{
				path: 'resetpassword',
				component: ResetPasswordComponent,
			}
		]
	}
];


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		TranslateModule.forChild(),
		StoreModule.forFeature('auth', authReducer),
		StoreModule.forFeature('setting', settingsReducer),
		EffectsModule.forFeature([AuthEffects, SettingEffects])
	],
	providers: [
		// InterceptService,
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: InterceptService,
		// 	multi: false
		// },
	],
	exports: [AuthComponent],
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterProviderComponent,
		RegisterParticipantComponent,
		ForgotPasswordComponent,
		AuthNoticeComponent,
		RegisterTherapistComponent,
		ConfirmEmailComponent,
		ResetPasswordComponent
	]
})

export class AuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
				AuthService,
				AuthGuard
			]
		};
	}
}
