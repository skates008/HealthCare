import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';

import { WidgetParticipantComponent } from '../dashboard/widgetGraph/WidgetParticipant.component';
import { ProviderAppointmentsAddComponent } from '../provider-appointments/appointments-add/appointments-add.component';
import { Select2Module } from 'ng2-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

// Material
import {
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatListModule,
  MatDatepickerModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatIconModule,
  MatSelectModule,
  MatButtonToggleModule,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AddressComponent } from './address/address.component';
import { ProviderEventsComponent } from '../provider-appointments/events/events.component';
import { EventsDialogComponent } from '../provider-appointments/events-dialog/events-dialog.component';
import { TimeEntryAddComponent } from '../timeEntry/timeEntry-add/timeEntry-add.component';
import { EventsDialogCheckinComponent } from '../provider-appointments/events-dialog-checkin/events-dialog-checkin.component';
import { RecurringAppointmentsDialogComponent } from '../provider-appointments/appointments-add/recurring-appointments-dialog/recurring-appointments-dialog.component';
// import { RecurringAppointmentsDialogComponent } from '../provider-appointments/appointments-add/recurring-appointments-dialog/recurring-appointments-dialog.component';

@NgModule({
  declarations: [
    WidgetParticipantComponent,
    AddressComponent,
    ProviderAppointmentsAddComponent,
    ProviderEventsComponent,
    EventsDialogComponent,
    TimeEntryAddComponent,
    EventsDialogCheckinComponent,
    RecurringAppointmentsDialogComponent
  ],
  providers: [ { provide: MAT_DIALOG_DATA, useValue: [] } ],
  entryComponents: [
    ProviderAppointmentsAddComponent,
    ProviderEventsComponent,
    EventsDialogComponent,
    TimeEntryAddComponent,
    EventsDialogCheckinComponent,
    RecurringAppointmentsDialogComponent
  ],
  imports: [
    CommonModule,
    Select2Module,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatListModule,
    Select2Module,
    ReactiveFormsModule,
    MatCardModule,
    NgxMaterialTimepickerModule,
    NgbModule,
    NgbModalModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatAutocompleteModule,
    GooglePlaceModule,
    MatSelectModule,
    CoreModule,
    PartialsModule,
    MatButtonToggleModule,
    
  ],
  exports: [
    WidgetParticipantComponent,
    AddressComponent,
    ProviderAppointmentsAddComponent,
    ProviderEventsComponent,
    EventsDialogComponent,
    TimeEntryAddComponent,
    EventsDialogCheckinComponent
   ]
})
export class SharedModule { }
