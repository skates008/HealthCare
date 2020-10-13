import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Core => Utils
import { HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from './../../core/_base/crud';

import { CoreModule } from './../../core/core.module';
import { PartialsModule } from './../../layout/partials/partials.module';

import { SettingsComponent } from './settings.component';

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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { DurationsComponent } from './duration/duration.component';
import { timesReducer, TimeEffects, billableItemsReducer, participantsReducer, ParticipantEffects, ModuleGuard } from './../../core/auth';
import { BillableItemsListComponent } from './billables-list/billables-list.component';
import { BillableItemsEditComponent } from './billableItems-edit/billableItems-edit.component';

@NgModule({
	declarations: [
		SettingsComponent,
		BillableItemsListComponent,
		DurationsComponent,
		BillableItemsEditComponent
		],
	imports: [
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		NgxPermissionsModule.forChild(),
		FormsModule,
		MatListModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatMenuModule,
		MatSelectModule,
    MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		NgbProgressbarModule,
		CoreModule,
		PartialsModule,
		StoreModule.forFeature('Time', timesReducer),
		StoreModule.forFeature('BillableItem', billableItemsReducer),
		StoreModule.forFeature('participant', participantsReducer),
		EffectsModule.forFeature([TimeEffects, ParticipantEffects]),
		MatButtonModule,
		RouterModule.forChild([
			{
				path: '',
				component: SettingsComponent,
				canActivate: [ModuleGuard],
				// data: { moduleName: 'Care-Plan'},
				children: [
					{
						path: '',
						redirectTo: 'setting',
						pathMatch: 'full'
					},
					{
						path: 'duration',
						component: DurationsComponent
					},
					{
						path: 'billableItems',
						component: BillableItemsListComponent
					},
					{
						path: 'billableItems/edit',
						component: BillableItemsEditComponent
					},
					{
						path: 'billableItems/edit/:id',
						component: BillableItemsEditComponent
					},
					{
						path: 'billableItems/add',
						component: BillableItemsEditComponent
					},
					{
						path: 'billableItems/add:id',
						component: BillableItemsEditComponent
					}
		]}
	])
	],
	providers: [
		InterceptService,
		ModuleGuard,
      	{
        	provide: HTTP_INTERCEPTORS,
       	 	useClass: InterceptService,
        	multi: true
      	},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		TypesUtilsService,
		LayoutUtilsService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	]
})
export class SettingsModule { }
