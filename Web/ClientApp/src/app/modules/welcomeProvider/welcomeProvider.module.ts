import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';


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
	MatRadioModule,
	MatTooltipModule,
	MatMenuModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatStepperModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { participantsReducer, ParticipantEffects, ProviderEffects, providersReducer } from './../../core/auth';
import { EffectsModule } from '@ngrx/effects';
import { WelcomeProviderDialogComponent } from './welcomeProvider-dialog/welcomeProvider-dialog.component';
import { WelcomeProviderComponent } from './welcomeProvider.component';
import { WelcomeProviderStepsComponent } from './welcomeProviderSteps/welcomeProvider.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [
		WelcomeProviderComponent,
		WelcomeProviderDialogComponent,
		WelcomeProviderStepsComponent
	],
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
		SharedModule,
		MatSelectModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatIconModule,
		MatRadioModule,
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
		StoreModule.forFeature('provider', providersReducer),
		EffectsModule.forFeature([ParticipantEffects, ProviderEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: WelcomeProviderStepsComponent,
			}
		])
	],
	entryComponents: [
		WelcomeProviderComponent
	]
})
export class WelcomeProviderModule { }
