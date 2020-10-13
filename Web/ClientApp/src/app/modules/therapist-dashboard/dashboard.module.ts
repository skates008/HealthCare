// Angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from './../../core/core.module';
import { PartialsModule } from './../../layout/partials/partials.module';
import { DashboardComponent } from './dashboard.component';

import {
	appointmentsReducer,
	AppointmentEffects,
	participantsReducer,
	ParticipantEffects,
	ModuleGuard,
	notificationReducer,
	NotificationEffects,
	tasksReducer,
	TaskEffects } from './../../core/auth'

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataParticipantComponent } from './participant/participant.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EventsComponent } from './appointment/events/events.component';
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
  } from '@angular/material';

import { Select2Module } from 'ng2-select2';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AppointmentsAddComponent } from './appointments-add/appointments-add.component';
import { DataTaskComponent } from './task/task.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	imports: [
		PerfectScrollbarModule,
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatSortModule,
		CommonModule,
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
		NgxMaterialTimepickerModule,
		ReactiveFormsModule,
		MatCardModule,
		PartialsModule,
		CoreModule,
		FormsModule,
		NgbModalModule,
		SharedModule,
		StoreModule.forFeature('participant', participantsReducer),
		StoreModule.forFeature('Task', tasksReducer),
		StoreModule.forFeature('appointment', appointmentsReducer),
		EffectsModule.forFeature([ParticipantEffects, AppointmentEffects, TaskEffects]),
		FlatpickrModule.forRoot(),
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),
		StoreModule.forFeature('notification', notificationReducer),
		EffectsModule.forFeature([NotificationEffects]),
		RouterModule.forChild([
			{
				path: '',
				// canActivate: [ModuleGuard],
				data: { moduleName: 'therapist-dashboard' },
				component: DashboardComponent
			},
		])],
	providers: [],
	declarations: [
		DashboardComponent,
		DataParticipantComponent,
		DataTaskComponent,
		AppointmentComponent,
		EventsComponent,
		AppointmentsAddComponent
	],
	 entryComponents: [
		EventsComponent,
		AppointmentsAddComponent
	 ]
})
export class therapistDashboardModule {
}
