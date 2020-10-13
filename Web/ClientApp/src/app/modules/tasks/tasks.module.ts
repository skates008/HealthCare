import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TasksEditComponent } from './tasks-edit/tasks-edit.component';
import { TasksComponent } from './tasks.component';

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
import {
	tasksReducer,
	TaskEffects,
	participantsReducer,
	ParticipantEffects,
	ModuleGuard} from './../../core/auth';
import { TaskViewComponent } from './task-view/task-view.component';

@NgModule({
	declarations: [
		TasksComponent,
		TasksListComponent,
		TasksEditComponent,
		TaskViewComponent
	],
	providers: [ModuleGuard],
	entryComponents: [
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
		MatTabsModule,
		MatSelectModule,
		MatTooltipModule,
		NgbTabsetModule,
		StoreModule.forFeature('participant', participantsReducer),
		StoreModule.forFeature('Task', tasksReducer),
		EffectsModule.forFeature([TaskEffects, ParticipantEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: TasksComponent,
				canActivate: [ModuleGuard],
				children: [
					{
						path: '',
						redirectTo: 'tasks',
						pathMatch: 'full'
					},
					{
						path: 'tasks',
						component: TasksListComponent
					},
					{
						path: 'task-details/:id',
						component: TaskViewComponent
					},
					{
						path: 'tasks/edit',
						component: TasksEditComponent
					},
					{
						path: 'tasks/edit/:id',
						component: TasksEditComponent
					},
					{
						path: 'tasks/add',
						component: TasksEditComponent
					},
					{
						path: 'tasks/add:id',
						component: TasksEditComponent
					}
				]
			}
		]),
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgbTabsetModule,
		PartialsModule,
		CoreModule
	]
})
export class TasksModule { }
