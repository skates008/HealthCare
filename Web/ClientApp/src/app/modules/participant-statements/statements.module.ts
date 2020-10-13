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
	timesReducer,
	TimeEffects,
	participantsReducer,
	ParticipantEffects,
	ModuleGuard} from './../../core/auth';
import { StatementsComponent } from './statements.component';
import { StatementsListComponent } from './statements-list/statements-list.component';
import { StatementViewComponent } from './statement-view/statement-view.component';

@NgModule({
	declarations: [
		StatementsComponent,
		StatementsListComponent,
		StatementViewComponent
	],
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
		MatRadioModule,
		MatTabsModule,
		MatSelectModule,
		MatTooltipModule,
		NgbTabsetModule,
		StoreModule.forFeature('participant', participantsReducer),
		StoreModule.forFeature('Time', timesReducer),
		EffectsModule.forFeature([TimeEffects, ParticipantEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: StatementsComponent,
				// canActivate: [ModuleGuard],
				data: { moduleName: 'StatementData' },
				children: [
					{
						path: '',
						redirectTo: 'statement',
						pathMatch: 'full'
					},
					{
						path: 'statement',
						component: StatementsListComponent
					},
					{
						path: 'statement-details/:id',
						component: StatementViewComponent
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
export class StatementsModule { }
