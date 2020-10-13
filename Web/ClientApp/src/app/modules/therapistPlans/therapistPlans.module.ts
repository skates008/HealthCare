import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';
import { TherapyServicesListComponent } from './therapistPlans-list/therapistPlans-list.component';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TherapyServicesEditComponent } from './therapistPlans-edit/therapistPlans-edit.component';
import { InvoicesComponent } from './therapistPlans.component';

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
	participantsReducer,
	ParticipantEffects,
	ModuleGuard,
	TherapyServiceEffects,
	careplansReducer,
	CareplanEffects} from './../../core/auth';
import { TherapistServiceViewComponent } from './therapistPlan-view/therapistPlan-view.component';
import { therapyServicesReducer } from './../../core/auth/_reducers/therapyService.reducers';

@NgModule({
	declarations: [
		InvoicesComponent,
		TherapyServicesListComponent,
		TherapyServicesEditComponent,
		TherapistServiceViewComponent
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
		StoreModule.forFeature('TherapyService', therapyServicesReducer),
		EffectsModule.forFeature([TherapyServiceEffects, CareplanEffects , ParticipantEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: TherapyServicesListComponent,
				// canActivate: [ModuleGuard],
				// data: { moduleName: 'TherapistPlanData' },
				children: [
					{
						path: '',
						redirectTo: 'therapistPlans',
						pathMatch: 'full'
					},
					{
						path: 'therapistPlans',
						component: TherapyServicesListComponent
					},
					{
						path: 'therapistPlan-details/:id',
						component: TherapistServiceViewComponent
					},
					// {
					// 	path: 'therapistPlans/edit',
					// 	component: TherapyServicesEditComponent
					// },
					// {
					// 	path: 'therapistPlans/edit/:id',
					// 	component: TherapyServicesEditComponent
					// },
					// {
					// 	path: 'therapistPlans/add',
					// 	component: TherapyServicesEditComponent
					// },
					// {
					// 	path: 'therapistPlans/add:id',
					// 	component: TherapyServicesEditComponent
					// }
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
export class TherapistPlansModule { }
