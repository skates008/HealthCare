// Angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from './../../core/core.module';
import { PartialsModule } from './../../layout/partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { appointmentsReducer, AppointmentEffects, participantsReducer, ParticipantEffects, ModuleGuard } from './../../core/auth'

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

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
	MatDialogModule
} from '@angular/material';
import { Select2Module } from 'ng2-select2';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EventsComponent } from './events/events.component';
import { AppointmentsAddComponent } from './appointments-add/appointments-add.component'
@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		FormsModule,
		NgbModalModule,
		SharedModule,
		FlatpickrModule.forRoot(),
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),
		StoreModule.forFeature('appointment', appointmentsReducer),
		StoreModule.forFeature('participant', participantsReducer),
		EffectsModule.forFeature([AppointmentEffects, ParticipantEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent,
				canActivate: [ModuleGuard],
				// data: { moduleName: 'Participant-Dashboard' }
			},
		]),

		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatDividerModule,
		NgbModule,
		MatButtonModule,
		MatDialogModule,
		MatRadioModule,
		MatListModule,
		Select2Module,
		NgxMaterialTimepickerModule],
	providers: [],
	declarations: [
		DashboardComponent,
		AppointmentsAddComponent,
		EventsComponent
	],
	entryComponents: [
		AppointmentsAddComponent,
		EventsComponent
	]
})
export class DashboardModule {
}
