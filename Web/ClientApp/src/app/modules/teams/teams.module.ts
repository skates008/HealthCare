import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';
import { TeamsListComponent } from './teams-list/teams-list.component';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TeamsEditComponent } from './teams-edit/teams-edit.component';
import { TeamsComponent } from './teams.component';

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
	teamsReducer,
	TeamEffects,
	participantsReducer,
	ParticipantEffects,
	ModuleGuard,
	practitionerReducer,
	PractitionerEffects} from './../../core/auth';
import { TeamViewComponent } from './teams-view/teams-view.component';

@NgModule({
	declarations: [
		TeamsComponent,
		TeamsListComponent,
		TeamsEditComponent,
		TeamViewComponent
	],
	entryComponents: [
	],
	imports: [
		MatAutocompleteModule,
		StoreModule,
		EffectsModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatCardModule,
		MatChipsModule,
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
		StoreModule.forFeature('practitioner', practitionerReducer),
		StoreModule.forFeature('Team', teamsReducer),
		EffectsModule.forFeature([TeamEffects, ParticipantEffects, PractitionerEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: TeamsComponent,
				canActivate: [ModuleGuard],
				children: [
					{
						path: '',
						redirectTo: 'teams',
						pathMatch: 'full'
					},
					{
						path: 'teams',
						component: TeamsListComponent
					},
					{
						path: 'team-details/:id',
						component: TeamViewComponent
					},
					{
						path: 'teams/edit',
						component: TeamsEditComponent
					},
					{
						path: 'teams/edit/:id',
						component: TeamsEditComponent
					},
					{
						path: 'teams/add',
						component: TeamsEditComponent
					},
					{
						path: 'teams/add:id',
						component: TeamsEditComponent
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
export class TeamsModule { }
