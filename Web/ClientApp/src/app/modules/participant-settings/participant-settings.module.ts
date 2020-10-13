import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { CoreModule } from './../../core/core.module';
import { PartialsModule } from './../../layout/partials/partials.module';

import { ParticipantSettingsComponent } from './participant-settings.component';

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

@NgModule({
    declarations: [ParticipantSettingsComponent],
    imports: [
        CommonModule,
        CoreModule,
        PartialsModule,
        FormsModule,
        MatButtonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ParticipantSettingsComponent
            }
        ])
    ]
})
export class ParticipantSettingsModule { }
