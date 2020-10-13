import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from '../../layout/partials/partials.module';
import { CoreModule } from '../../core/core.module';
import { CareplansListComponent } from './careplan-list/careplans-list.component';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CareplansEditComponent } from './careplan-edit/careplans-edit.component';

import {
	MatAutocompleteModule,
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
	MatCardModule,
	MatChipsModule,
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
	MatExpansionModule,
	MatMenuModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
} from '@angular/material';
import {
	careplansReducer,
	CareplanEffects,
	participantsReducer,
	ParticipantEffects,
	practitionerReducer,
	PractitionerEffects,
	ModuleGuard,
	noteReducer,
	budgetReducer,
	BudgetEffects,
	NoteEffects,
	invoicesReducer,
	InvoiceEffects,
	userNoteReducer,
	UserNoteEffects} from '../../core/auth';
import { CareplanViewComponent } from './careplan-view/careplan-view.component';
import { CareplansComponent } from './careplans.component';
import { CareplansAddComponent } from './careplan-add/careplans-add.component';
import { NoteListComponent } from './careplan-view/note/note-list.component';
import { CareplanNoteViewDialogComponent } from './careplan-view/note/note-view/note-view.dialog.component';

@NgModule({
	declarations: [
		CareplansComponent,
		CareplansListComponent,
		CareplansEditComponent,
		CareplansAddComponent,
		CareplanViewComponent,
		NoteListComponent,
		CareplanNoteViewDialogComponent
	],
	providers: [ModuleGuard],
	entryComponents: [
		CareplanNoteViewDialogComponent
	],
	imports: [
		StoreModule,
		EffectsModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatCardModule,
		MatAutocompleteModule,
		MatDividerModule,
		MatListModule,
		MatButtonModule,
		MatDatepickerModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDialogModule,
		MatIconModule,
		MatExpansionModule,
		MatProgressSpinnerModule,
		MatPaginatorModule,
		MatMenuModule,
		MatTabsModule,
		MatSelectModule,
		MatTooltipModule,
		NgbTabsetModule,
		StoreModule.forFeature('participant', participantsReducer),
		StoreModule.forFeature('practitioner', practitionerReducer),
		StoreModule.forFeature('invoice', invoicesReducer),
		StoreModule.forFeature('Careplan', careplansReducer),
		StoreModule.forFeature('note', noteReducer),
		StoreModule.forFeature('budget', budgetReducer),
		StoreModule.forFeature('userNote', userNoteReducer),
		EffectsModule.forFeature([
			InvoiceEffects,
			CareplanEffects,
			ParticipantEffects,
			NoteEffects,
			PractitionerEffects,
			UserNoteEffects,
			BudgetEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: CareplansComponent,
				canActivate: [ModuleGuard],
				data: { moduleName: 'Care-Plan'},
				children: [
					{
						path: '',
						redirectTo: 'careplans',
						pathMatch: 'full'
					},
					{
						path: 'careplans',
						component: CareplansListComponent
					},
					{
						path: 'careplan-details/:id',
						component: CareplanViewComponent
					},
					{
						path: 'careplans/edit/:id',
						component: CareplansEditComponent
					},
					{
						path: 'careplans/add',
						component: CareplansAddComponent
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
export class CareplansModule { }
