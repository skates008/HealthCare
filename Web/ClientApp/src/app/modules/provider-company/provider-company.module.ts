// Angular
import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';


import {
	MatAutocompleteModule,
	MatNativeDateModule,
	MatFormFieldModule,
	MatInputModule,
	MatRadioModule,
	MatButtonModule,
	MatCardModule,
	MatChipsModule,
	MatSelectModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatIconModule,
	MatSliderModule,
	MatPaginatorModule,
	MatSortModule,
	MatSidenavModule,
	MatSnackBarModule,
	MatStepperModule,
	MatToolbarModule,
	MatDividerModule,
	MatTabsModule,
	MatTableModule,
	MatTooltipModule,
	MatListModule,
	MatGridListModule,
	MatButtonToggleModule,
	MatBottomSheetModule,
	MatExpansionModule,
	MatMenuModule,
	MatTreeModule,
	MAT_BOTTOM_SHEET_DATA,
	MatBottomSheetRef,
	MAT_DATE_LOCALE,
	MAT_DATE_FORMATS,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
	ModuleGuard,
	profilesReducer,
	ProfileEffects,
	AppointmentTypeEffects,
	appointmentTypeReducer
} from './../../core/auth';
import { SharedModule } from '../shared/shared.module';
import { ProviderProfileComponent } from './provider-profile.component';
import { ProfilePictureDialogComponent } from './provider-profile-picture/provider-profile-picture.component';
import { CommunicationService } from './communication.service';
import { ProviderProfileBusinessComponent } from './provider-profile-business/provider-profile-business.component';
import { ProviderProfileBasicComponent } from './provider-profile-basic/provider-profile-basic.component';
import { ProviderProfileServiceComponent } from './provider-profile-service/provider-profile-service.component';
import { ProviderProfileAccountComponent } from './provider-profile-account/provider-profile-account.component';
import { ProviderbillingSettingComponent } from './provider-billingSetting/provider-billingSetting.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ProviderAppointmentAddDialogComponent } from './provider-appointment/provider-appointment-add/provider-appointment-add.dialog.component';
import { ProviderAppointmentEditDialogComponent } from './provider-appointment/provider-appointment-edit/provider-appointment-edit.dialog.component';
import { ProviderAppointmentListComponent } from './provider-appointment/provider-appointment-list.component';

@NgModule({
	declarations: [
		ProviderProfileComponent,
		ProviderProfileBasicComponent,
		ProviderProfileBusinessComponent,
		ProviderProfileAccountComponent,
		ProviderProfileServiceComponent,
		ProfilePictureDialogComponent,
		ProviderbillingSettingComponent,
		ProviderAppointmentListComponent,
		ProviderAppointmentEditDialogComponent,
		ProviderAppointmentAddDialogComponent,
	],
	providers: [
		CommunicationService,
		ModuleGuard,
		// {
		// 	provide: MAT_DIALOG_DEFAULT_OPTIONS,
		// 	useValue: {
		// 		hasBackdrop: true,
		// 		panelClass: 'kt-mat-dialog-container__wrapper',
		// 		height: 'auto',
		// 		width: '500px'
		// 	}
		// }
	],
	entryComponents: [
		ProfilePictureDialogComponent,
		ProviderAppointmentEditDialogComponent,
		ProviderAppointmentAddDialogComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		PartialsModule,
		CoreModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatCardModule,
		MatButtonModule,
		MatDatepickerModule,
		MatCheckboxModule,
		MatDialogModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatMenuModule,
		MatTabsModule,
		MatSelectModule,
		MatTooltipModule,
		NgbTabsetModule,
		MatListModule,
		MatDividerModule,
		MatExpansionModule,
		SharedModule,
		AngularEditorModule,
		GooglePlaceModule,
		StoreModule.forFeature('Profile', profilesReducer),
		StoreModule.forFeature('appointmentType', appointmentTypeReducer),
		EffectsModule.forFeature([ProfileEffects, AppointmentTypeEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: ProviderProfileComponent,
				canActivate: [ModuleGuard],
				// data: { moduleName: 'provider-profile' },
				children: [
					{
						path: '',
						redirectTo: 'basic',
						pathMatch: 'full'
					},
					{
						path: 'business',
						component: ProviderProfileBusinessComponent
					},
					{
						path: 'basic',
						component: ProviderProfileBasicComponent
					},
					{
						path: 'service',
						component: ProviderProfileServiceComponent
					},
					{
						path: 'account',
						component: ProviderProfileAccountComponent
					},
					{
						path: 'billingSetting',
						component: ProviderbillingSettingComponent
					},
					{
						path: 'appointment-type',
						component: ProviderAppointmentListComponent
					},
				]
			},
		]),
	]
})
export class ProviderCompanyModule { }
