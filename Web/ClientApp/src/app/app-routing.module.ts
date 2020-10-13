// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './layout/theme/base/base.component';
import { ErrorPageComponent } from './layout/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
	{ path: 'auth', loadChildren: () => import('../app/modules/auth/auth.module').then(m => m.AuthModule) },

	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('../app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'therapist-dashboard',
				loadChildren: () => import('../app/modules/therapist-dashboard/dashboard.module').then(m => m.therapistDashboardModule)
			},
			{
				path: 'provider-dashboard',
				loadChildren: () => import('../app/modules/provider-dashboard/dashboard.module').then(m => m.providerDashboardModule)
			},
			{
				path: 'user-management',
				loadChildren: () => import('../app/modules/user-management/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('../app/layout/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'participant-record',
				loadChildren: () => import('../app/modules/participant-record/participant-record.module').then(m => m.ParticipantRecordModule)
			},
			{
				path: 'therapistPlans',
				loadChildren: () => import('../app/modules/therapistPlans/therapistPlans.module').then(m => m.TherapistPlansModule)
			},
			{
				path: 'times',
				loadChildren: () => import('../app/modules/timeEntry/timeEntry.module').then(m => m.TimeEntryModule)
			},
			{
				path: 'statements',
				loadChildren: () => import('../app/modules/participant-statements/statements.module').then(m => m.StatementsModule)
			},
			{
				path: 'tasks',
				loadChildren: () => import('../app/modules/tasks/tasks.module').then(m => m.TasksModule)
			},
			{
				path: 'teams',
				loadChildren: () => import('../app/modules/teams/teams.module').then(m => m.TeamsModule)
			},
			{
				path: 'billing',
				loadChildren: () => import('../app/modules/invoice/invoices.module').then(m => m.InvoicesModule)
			},
			{
				path: 'careplans',
				loadChildren: () => import('../app/modules/careplans/careplans.module').then(m => m.CareplansModule)
			},
			{
				path: 'participant-careplan',
				loadChildren: () => import('./modules/participant-careplans/careplans.module').then(m => m.ParticipantCareplansModule)
			},
			{
				path: 'settings',
				loadChildren: () => import('../app/modules/settings/settings.module').then(m => m.SettingsModule)
			},
			{
				path: 'welcome',
				loadChildren: () => import('../app/modules/welcome/welcome.module').then(m => m.WelcomeModule)
			},
			{
				path: 'welcomeTherapist',
				loadChildren: () => import('../app/modules/welcomeTherapist/welcomeTherapist.module').then(m => m.WelcomeTherapistModule)
			},
			{
				path: 'welcomeProvider',
				loadChildren: () => import('../app/modules/welcomeProvider/welcomeProvider.module').then(m => m.WelcomeProviderModule)
			},
			{
				path: 'participant-profile',
				loadChildren: () => import('../app/modules/participant-profile/participant-profile.module').then(m => m.ParticipantProfileModule)
			},
			{
				path: 'profile',
				loadChildren: () => import('../app/modules/provider-profile/provider-profile.module').then(m => m.ProviderProfileModule)
			},
			{
				path: 'provider',
				loadChildren: () => import('../app/modules/provider-company/provider-company.module').then(m => m.ProviderCompanyModule)
			},
			{
				path: 'therapist-profile',
				loadChildren: () => import('../app/modules/therapist-profile/therapist-profile.module').then(m => m.TherapistProfileModule)
			},
			{
				path: 'my-settings',
				loadChildren: () => import('../app/modules/participant-settings/participant-settings.module').then(m => m.ParticipantSettingsModule)
			},
			{
				path: 'provider-appointments',
				loadChildren: () => import('../app/modules/provider-appointments/provider-appointments.module').then(m => m.ProviderAppointmentModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 403,
					'title': '403... Access forbidden',
					'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{ path: 'error/:type', component: ErrorPageComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
		]
	},
	{ path: '', redirectTo: 'auth', pathMatch: 'full' },
	{ path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
