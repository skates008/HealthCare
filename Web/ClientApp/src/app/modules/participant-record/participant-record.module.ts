// Angular
import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTabsetModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from '../../layout/partials/partials.module';
import { CoreModule } from '../../core/core.module';
import { ParticipantRecordComponent } from './participant-record.component';
import { ParticipantRecordAddComponent } from './participant-record-add/participant-record-add.component';
import { ParticipantRecordViewComponent } from './participant-record-view/participant-record-view.component';
import { ParticipantRecordEditComponent } from './participant-record-edit/participant-record-edit.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

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
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
} from '@angular/material';

import {
	participantsReducer,
	ParticipantEffects,
	ModuleGuard,
	appointmentsReducer,
	AppointmentEffects,
	medicationsReducer,
	MedicationEffects,
	AllergyEffects,
	allergiesReducer,
	noteReducer,
	NoteEffects,
	careplansReducer,
	CareplanEffects,
	tasksReducer,
	TaskEffects,
	invoicesReducer,
	InvoiceEffects,
	practitionerReducer,
	PractitionerEffects,
	timesReducer,
	TimeEffects,
	UserNoteEffects,
	AssessmentEffects,
	assessmentReducer,
	AgreementEffects,
	agreementReducer,
	fileReducer,
	FileEffects,
	userNoteReducer
} from '../../core/auth';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ProfileComponent } from './participant-record-view/profile/profile.component';
import { HistoryComponent } from './participant-record-view/history/history.component';
import { BillingComponent } from './participant-record-view/billing/billing.component';
import { Select2Module } from 'ng2-select2';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SharedModule } from '../shared/shared.module';
import { AppointmentComponent } from './participant-record-view/appointment/appointment.component';
import { InvoiceComponent } from './participant-record-view/invoice/invoice.component';
import { TimeEntryComponent } from './participant-record-view/timeEntry/timeEntry.component';
import { AppointmentListComponent } from './participant-record-view/appointmentList/appointmentlist.component';
import { AssessmentListComponent } from './participant-record-view/assessment/assessment-list.component';
import { AssessmentAddDialogComponent } from './participant-record-view/assessment/assessment-add/assessment-add.dialog.component';
import { AssessmentEditDialogComponent } from './participant-record-view/assessment/assessment-edit/assessment-edit.dialog.component';
import { AgreementListComponent } from './participant-record-view/agreement/agreement-list.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AgreementAddDialogComponent } from './participant-record-view/agreement/agreement-add/agreement-add.dialog.component';
import { AgreementEditDialogComponent } from './participant-record-view/agreement/agreement-edit/agreement-edit.dialog.component';
import { FileListComponent } from './participant-record-view/files/file-list.component';
import { NoteListComponent } from './participant-record-view/note/note-list.component';
import { NoteEditDialogComponent } from './participant-record-view/note/note-edit/note-edit.dialog.component';
import { UserNoteAddDialogComponent } from './participant-record-view/note/note-add/note-add.dialog.component';

@NgModule({
	declarations: [
		ParticipantRecordComponent,
		ParticipantRecordAddComponent,
		ParticipantRecordViewComponent,
		ParticipantRecordEditComponent,
		ProfileComponent,
		HistoryComponent,
		BillingComponent,
		AppointmentComponent,
		InvoiceComponent,
		TimeEntryComponent,
		AssessmentListComponent,
		AgreementListComponent,
		AgreementEditDialogComponent,
		AgreementAddDialogComponent,
		AssessmentAddDialogComponent,
		AssessmentEditDialogComponent,
		AppointmentListComponent,
		FileListComponent,
		NoteListComponent,
		UserNoteAddDialogComponent,
		NoteEditDialogComponent
	],
	providers: [ModuleGuard],
	entryComponents: [
		AssessmentEditDialogComponent,
		AssessmentAddDialogComponent,
		AgreementAddDialogComponent,
		AgreementEditDialogComponent,
		UserNoteAddDialogComponent,
		NoteEditDialogComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		PartialsModule,
		CoreModule,
		MatRadioModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatCardModule,
		NgbModule,
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
		Select2Module,
		FileUploadModule,
		SharedModule,
		MatAutocompleteModule,
		NgxMaterialTimepickerModule,
		GooglePlaceModule,
		StoreModule.forFeature('participant', participantsReducer),
		StoreModule.forFeature('appointment', appointmentsReducer),
		StoreModule.forFeature('medication', medicationsReducer),
		StoreModule.forFeature('Time', timesReducer),
		StoreModule.forFeature('allergy', allergiesReducer),
		StoreModule.forFeature('note', noteReducer),
		StoreModule.forFeature('Careplan', careplansReducer),
		StoreModule.forFeature('task', tasksReducer),
		StoreModule.forFeature('Invoice', invoicesReducer),
		StoreModule.forFeature('practitioner', practitionerReducer),
		StoreModule.forFeature('assessment', assessmentReducer),
		StoreModule.forFeature('userNote', userNoteReducer),
		StoreModule.forFeature('agreement', agreementReducer),
		StoreModule.forFeature('file', fileReducer),
		EffectsModule.forFeature([
			ParticipantEffects,
			InvoiceEffects,
			AppointmentEffects,
			CareplanEffects,
			MedicationEffects,
			AllergyEffects,
			NoteEffects,
			TaskEffects,
			PractitionerEffects,
			TimeEffects,
			UserNoteEffects,
			AssessmentEffects,
			AgreementEffects,
			FileEffects
		]),
		RouterModule.forChild([
			{
				path: '',
				component: ParticipantRecordComponent,
				canActivate: [ModuleGuard],
				data: { moduleName: 'participant-record' },
				children: [
					{
						path: '',
						redirectTo: 'participants',
						pathMatch: 'full'
					},
					{
						path: 'participants',
						component: ParticipantRecordViewComponent
					},
					{
						path: 'participant:id',
						component: ParticipantRecordViewComponent
					},
					{
						path: 'participants/edit',
						component: ParticipantRecordEditComponent
					},
					{
						path: 'participants/edit/:id',
						component: ParticipantRecordEditComponent
					},
					{
						path: 'participants/add',
						component: ParticipantRecordAddComponent
					},
					{
						path: 'participants/add:id',
						component: ParticipantRecordAddComponent
					},
					{
						path: 'participants/oldAdd',
						component: ParticipantRecordAddComponent
					},
					{
						path: 'participants/profile/:id',
						component: ProfileComponent
					},
					{
						path: 'participants/history/:id',
						component: HistoryComponent
					},
					{
						path: 'participants/billing/:id',
						component: BillingComponent
					}
				]
			}
		]),
	]
})
export class ParticipantRecordModule { }
