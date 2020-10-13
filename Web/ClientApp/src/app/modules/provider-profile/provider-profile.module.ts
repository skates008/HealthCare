// Angular
import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';

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
    MAT_DIALOG_DEFAULT_OPTIONS,
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
    ModuleGuard,
    profilesReducer,
    ProfileEffects
} from './../../core/auth';
import { SharedModule } from '../shared/shared.module';
import { ProviderProfileComponent } from './provider-profile.component';
import { ProviderProfilePasswordComponent } from './provider-profile-password/provider-profile-password.component';
import { ProviderProfilePersonalComponent } from './provider-profile-personal/provider-profile-personal.component';
import { ProfilePictureDialogComponent } from './provider-profile-picture/provider-profile-picture.component';
import { CommunicationService } from './communication.service';

@NgModule({
    declarations: [
        ProviderProfileComponent,
        ProviderProfilePasswordComponent,
        ProviderProfilePersonalComponent,
        ProfilePictureDialogComponent
    ],
    providers: [
        CommunicationService,
        ModuleGuard,
        {
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '500px'
			}
		}
    ],
    entryComponents: [
        ProfilePictureDialogComponent
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
        StoreModule.forFeature('Profile', profilesReducer),
        EffectsModule.forFeature([ProfileEffects]),
        RouterModule.forChild([
            {
                path: '',
                component: ProviderProfileComponent,
                canActivate: [ModuleGuard],
                // data: { moduleName: 'provider-profile' },
                children: [
                    {
                        path: '',
                        redirectTo: 'personal',
                        pathMatch: 'full'
                    },
                    {
                        path: 'password',
                        component: ProviderProfilePasswordComponent
                    },
                    {
                        path: 'personal',
                        component: ProviderProfilePersonalComponent
                    }
                ]
            },
        ]),
    ]
})
export class ProviderProfileModule { }
