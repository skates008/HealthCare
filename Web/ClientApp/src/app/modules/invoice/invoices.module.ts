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
	invoicesReducer,
	InvoiceEffects,
	participantsReducer,
	ParticipantEffects,
	ModuleGuard} from './../../core/auth';
import { InvoicesComponent } from './invoices.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

@NgModule({
	declarations: [
		InvoicesComponent,
		InvoiceViewComponent,
		InvoiceListComponent
	],
	providers: [ModuleGuard],
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
		StoreModule.forFeature('Invoice', invoicesReducer),
		EffectsModule.forFeature([InvoiceEffects, ParticipantEffects]),
		RouterModule.forChild([
			{
				path: '',
				component: InvoicesComponent,
				canActivate: [ModuleGuard],
				// data: { moduleName: 'InvoiceData' },
				children: [
					{
						path: '',
						redirectTo: 'billing',
						pathMatch: 'full'
					},
					{
						path: 'billing',
						component: InvoiceListComponent
					},
					{
						path: 'billing-details/:id',
						component: InvoiceViewComponent
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
export class InvoicesModule { }
