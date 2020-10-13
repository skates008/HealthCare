
import { NgModule, Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbTabsetModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

// Metronic
import { PartialsModule } from './../../layout/partials/partials.module';
import { CoreModule } from './../../core/core.module';

import {
	MAT_DATE_LOCALE,
	MAT_DATE_FORMATS,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
} from '@angular/material';


import { SharedModule } from '../shared/shared.module';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { ProviderAppointmentsComponent } from './provider-appointments.component';
import { ProviderAppointmentsViewComponent } from './provider-appointments-view/provider-appointments-view.component';
import { StoreModule } from '@ngrx/store';
import { appointmentsReducer, participantsReducer, noteReducer, settingsReducer, practitionerReducer, AppointmentEffects, ParticipantEffects, NoteEffects, SettingEffects, PractitionerEffects, ModuleGuard, teamsReducer, TeamEffects, billableItemsReducer, BillableItemEffects, careplansReducer, CareplanEffects, timesReducer, TimeEffects } from './../../core/auth';
import { EffectsModule } from '@ngrx/effects';
import { ProviderEventsComponent } from './events/events.component';
import { EventsDialogComponent } from './events-dialog/events-dialog.component';
import { AppointmentTimelineComponent } from './appointment-timeline/appointment-timeline.component';
import { AppointmentTimegridComponent } from './appointment-timegrid/appointment-timegrid.component';
import { EventsDialogCheckinComponent } from './events-dialog-checkin/events-dialog-checkin.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { TimeEntryAddComponent } from '../timeEntry/timeEntry-add/timeEntry-add.component';
// import { RecurringAppointmentsDialogComponent } from './appointments-add/recurring-appointments-dialog/recurring-appointments-dialog.component';

const DATEFNS_FORMATS_EN_LOCALE = {
    parseInput: 'dd/MM/yyyy HH:mm || dd/MM/yyyy', // multiple date input types separated by ||
    fullPickerInput: 'dd/MM/yyyy HH:mm',
    datePickerInput: 'dd/MM/yyyy',
    timePickerInput: 'HH:mm',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
};

@NgModule({
	imports: [
		PartialsModule,
		CoreModule,
		CommonModule,
        FormsModule,
        ReactiveFormsModule,
		NgbModalModule,
		NgbTabsetModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatDialogModule,
        MatFormFieldModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatDividerModule,
        MatButtonModule,
        MatDialogModule,
        MatRadioModule,
        MatListModule,
        MatCardModule,
        GooglePlaceModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatIconModule,
        MatTabsModule,
        SharedModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        FullCalendarModule,
		FlatpickrModule.forRoot(),
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
        }),
        StoreModule.forFeature('appointment', appointmentsReducer),
        StoreModule.forFeature('participant', participantsReducer),
        StoreModule.forFeature('note', noteReducer),
        StoreModule.forFeature('setting', settingsReducer),
        StoreModule.forFeature('practitioner', practitionerReducer),
        StoreModule.forFeature('team', teamsReducer),
        StoreModule.forFeature('BillableItem', billableItemsReducer),
        StoreModule.forFeature('Careplan', careplansReducer),
        StoreModule.forFeature('Time', timesReducer),
        EffectsModule.forFeature([AppointmentEffects, ParticipantEffects, NoteEffects, SettingEffects, PractitionerEffects, TeamEffects, BillableItemEffects,CareplanEffects,TimeEffects]),
        RouterModule.forChild([
            {
                path: '',
                component: ProviderAppointmentsComponent,
                canActivate: [ModuleGuard],
                // data: { moduleName: 'provider-appointments'},
                children: [
                    {
						path: '',
						redirectTo: 'view',
						pathMatch: 'full'
					},
					{
						path: 'view',
						component: ProviderAppointmentsViewComponent
                    },
                    {
						path: 'timeline',
						component: AppointmentTimelineComponent
                    },
                    {
						path: 'timegrid',
						component: AppointmentTimegridComponent
                    },
                    {
						path: 'appointment-details/:id',
						component: AppointmentDetailsComponent
                    }

                ]
            },
        ]),
	],
    declarations: [ProviderAppointmentsComponent, ProviderAppointmentsViewComponent, AppointmentTimelineComponent, AppointmentTimegridComponent, AppointmentDetailsComponent, 
        // RecurringAppointmentsDialogComponent
    ],
    entryComponents: [
        // RecurringAppointmentsDialogComponent
    ],
      providers: [
        ModuleGuard,
        {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-AU'},
      ],
	exports: [ProviderAppointmentsComponent]
})
export class ProviderAppointmentModule { }
