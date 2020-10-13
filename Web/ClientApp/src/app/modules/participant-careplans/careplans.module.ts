import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';
import { CareplansListComponent } from './careplan-list/careplans-list.component';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CareplansEditComponent } from './careplan-edit/careplans-edit.component';


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
	careplansReducer,
	CareplanEffects,
	participantsReducer,
	budgetReducer,
	BudgetEffects,
	ParticipantEffects,
	ModuleGuard
} from './../../core/auth';
import { CareplanViewComponent } from './careplan-view/careplan-view.component';
import { CareplansComponent } from './careplans.component';

@NgModule({
	declarations: [
		CareplansComponent,
		CareplansListComponent,
		CareplansEditComponent,
		CareplanViewComponent
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
		MatTabsModule,
		MatSelectModule,
		MatTooltipModule,
		NgbTabsetModule,
		StoreModule.forFeature('participant', participantsReducer),
		StoreModule.forFeature('Careplan', careplansReducer),
		StoreModule.forFeature('budget', budgetReducer),
		EffectsModule.forFeature([CareplanEffects, ParticipantEffects, BudgetEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: CareplansComponent,
				// canActivate: [ModuleGuard],
				data: { moduleName: 'My-care-Plan' },
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
						path: 'careplans/edit',
						component: CareplansEditComponent
					},
					{
						path: 'careplans/edit/:id',
						component: CareplansEditComponent
					},
					{
						path: 'careplans/add',
						component: CareplansEditComponent
					},
					{
						path: 'careplans/add:id',
						component: CareplansEditComponent
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
export class ParticipantCareplansModule { }
