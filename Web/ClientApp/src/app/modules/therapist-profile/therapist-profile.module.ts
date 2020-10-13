import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TherapistProfileComponent } from './therapist-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { usersReducer, UserEffects } from './../../core/auth';



import {
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatStepperModule,
    MatDividerModule,
    MatListModule
} from '@angular/material';

@NgModule({
    declarations: [TherapistProfileComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgbTabsetModule,
        PartialsModule,
        CoreModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatTabsModule,
        MatTableModule,
        MatTooltipModule,
        MatMenuModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatStepperModule,
        MatDividerModule,
        MatListModule,
        StoreModule.forFeature('users', usersReducer),
        EffectsModule.forFeature([UserEffects]),

        RouterModule.forChild([
            {
                path: '',
                component: TherapistProfileComponent,
            }
        ])
    ],
    entryComponents: [
    ]
})
export class TherapistProfileModule { }
