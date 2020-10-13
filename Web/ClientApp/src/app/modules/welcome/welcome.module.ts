import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';

import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';

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
	MatStepperModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { participantsReducer, ParticipantEffects } from './../../core/auth';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
	declarations: [WelcomeComponent, WelcomeDialogComponent],
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
		StoreModule.forFeature('participant', participantsReducer),
		EffectsModule.forFeature([ParticipantEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: WelcomeDialogComponent,
			}
		])
	],
	entryComponents: [
		WelcomeDialogComponent
	]
})
export class WelcomeModule { }
