// Angular
import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';

import { ParticipantProfileComponent } from './participant-profile.component';
import { ParticipantProfileViewComponent } from './participant-profile-view/participant-profile-view.component';


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

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
    participantsReducer,
    ParticipantEffects,
    MedicationEffects,
    medicationsReducer,
    allergiesReducer,
    AllergyEffects,
    BudgetEffects,
    budgetReducer,
    ModuleGuard
} from './../../core/auth';
import { ParticipantProfileEditComponent } from './participant-profile-edit/participant-profile-edit.component';
import { MedicationComponent } from './participant-profile-view/medication/medication.component';
import { AllergyComponent } from './participant-profile-view/allergy/allergy.component';
import { BudgetComponent } from './participant-profile-view/budget/budget.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        ParticipantProfileComponent,
        ParticipantProfileViewComponent,
        ParticipantProfileEditComponent,
        MedicationComponent,
        AllergyComponent,
        BudgetComponent
    ],
    entryComponents: [
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PartialsModule,
        CoreModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSortModule,
        MatCardModule,
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
        SharedModule,
        StoreModule.forFeature('participant', participantsReducer),
        StoreModule.forFeature('medication', medicationsReducer),
        StoreModule.forFeature('allergy', allergiesReducer),
        StoreModule.forFeature('budget', budgetReducer),

        EffectsModule.forFeature([ParticipantEffects, MedicationEffects, AllergyEffects, BudgetEffects]),
        RouterModule.forChild([
            {
                path: '',
                component: ParticipantProfileComponent,
                // canActivate: [ModuleGuard],
                data: { moduleName: 'participant-profile' },
                children: [
                    {
                        path: '',
                        redirectTo: 'view',
                        pathMatch: 'full'
                    },
                    {
                        path: 'view',
                        component: ParticipantProfileViewComponent
                    },
                    {
                        path: 'edit',
                        component: ParticipantProfileEditComponent
                    },
                    {
                        path: 'medication/add',
                        component: MedicationComponent
                    },
                    {
                        path: 'allergies/add',
                        component: AllergyComponent
                    },
                    {
                        path: 'budget/add',
                        component: BudgetComponent
                    }
                ]
            },
        ]),
    ]
})
export class ParticipantProfileModule { }
