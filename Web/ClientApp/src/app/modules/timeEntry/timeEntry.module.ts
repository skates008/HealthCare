import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TimeEntryComponent } from './timeEntry.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import {
	MatAutocompleteModule,
	MatFormFieldModule,
	MatInputModule,
	MatRadioModule,
	MatButtonModule,
	MatCardModule,
	MatSelectModule,
	MatProgressSpinnerModule,
	MatIconModule,
	MatPaginatorModule,
	MatSortModule,
	MatDividerModule,
	MatTabsModule,
	MatTableModule,
	MatTooltipModule,
	MatListModule,
	MatMenuModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
} from '@angular/material';
import {
	timesReducer,
	TimeEffects,
	participantsReducer,
	ParticipantEffects,
	careplansReducer,
	CareplanEffects,
	ModuleGuard,
	billableItemsReducer,
	BillableItemEffects} from './../../core/auth';
import { Select2Module } from 'ng2-select2';
// import { TimeEntryAddComponent } from './timeEntry-add/timeEntry-add.component';
import { TimeEntryViewComponent } from './timeEntry-view/timeEntry-view.component';
import { TimeEntryEditComponent } from './timeEntry-edit/timeEntry-edit.component';
import { TimeEntriesComponent } from './timeEntry-list/timeEntry-list.component';
import { SharedModule } from '../shared/shared.module';
import { TimeEntryAddComponent } from './timeEntry-add/timeEntry-add.component';

@NgModule({
	declarations: [
		TimeEntriesComponent,
		TimeEntryComponent,
		TimeEntryEditComponent,
		TimeEntryViewComponent,
		// TimeEntryAddComponent,
	],
	providers: [ModuleGuard],
	entryComponents: [
		// TimeEntryAddComponent
	],
	imports: [
		StoreModule,
		EffectsModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatCardModule,
		MatDividerModule,
		MatListModule,
		MatButtonModule,
		MatDatepickerModule,
		MatCheckboxModule,
		MatDialogModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatMenuModule,
		MatRadioModule,
		MatAutocompleteModule,
		MatTabsModule,
		MatSelectModule,
		MatTooltipModule,
		NgbTabsetModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		SharedModule,
		StoreModule.forFeature('participant', participantsReducer),
		StoreModule.forFeature('Time', timesReducer),
		StoreModule.forFeature('Careplan', careplansReducer),
		StoreModule.forFeature('BillableTimeEntries', billableItemsReducer),

		EffectsModule.forFeature([TimeEffects, ParticipantEffects, CareplanEffects, BillableItemEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: TimeEntryComponent,
				canActivate: [ModuleGuard],
				// data: { moduleName: 'TimeData' },
				children: [
					{
						path: '',
						redirectTo: 'timeEntry',
						pathMatch: 'full'
					},
					{
						path: 'timeEntry',
						component: TimeEntriesComponent
					},
					{
						path: 'timeEntry-details/:id',
						component: TimeEntryViewComponent
					},
					{
						path: 'timeEntry/edit/:id',
						component: TimeEntryEditComponent
					},
					{
						path: 'timeEntry/add',
						component: TimeEntryAddComponent
					}
				]
			}
		]),
		CommonModule,
		FormsModule,
		Select2Module,
		ReactiveFormsModule,
		NgbTabsetModule,
		PartialsModule,
		CoreModule
	]
})
export class TimeEntryModule { }
