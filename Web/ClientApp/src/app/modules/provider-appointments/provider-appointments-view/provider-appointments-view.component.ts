import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { SubheaderService } from './../../../core/_base/layout';
import momentPlugin from '@fullcalendar/moment';

// import { AppointmentsRequestComponent } from '../appointments-request/appointments-request.component';
// import { EventsComponent } from './events/events.component'
import {
	Appointment, AppointmentsPageRequested,
  selectQueryResultAppointment, ParticipantsPageRequested, AppointmentUpdated, Notification, NotificationOnServerCreated, selectAppointmentActionLoading, selectAppointmentPageLoading, SettingPageRequested, selectQueryResultSetting,
  PractitionerPageRequested,
  selectPractitionerInStore,
  currentUser
} from './../../../core/auth';

import { ProviderAppointmentsAddComponent } from '../appointments-add/appointments-add.component';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatAutocompleteTrigger } from '@angular/material';


import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { QueryParamsModel } from './../../../core/_base/crud';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, AppointmentService, PractitionerService, ParticipantService } from './../../../core/_services';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { ProviderEventsComponent } from '../events/events.component';
import { EventsDialogComponent} from '../events-dialog/events-dialog.component';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { EventsDialogCheckinComponent } from '../events-dialog-checkin/events-dialog-checkin.component';
import { AppointmentListComponent } from '../../participant-record/participant-record-view/appointmentList/appointmentlist.component';

@Component({
  selector: 'kt-provider-appointments-view',
  templateUrl: './provider-appointments-view.component.html',
  styleUrls: ['./provider-appointments-view.component.scss']
})
export class ProviderAppointmentsViewComponent implements OnInit, OnDestroy{

  @ViewChild('calendar',  {static: true }) calendarComponent: FullCalendarComponent; // the #calendar in the template
  @ViewChild('auto',  {static: true })
  autoComplete: MatAutocompleteTrigger;
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [
    // { title: 'Event Now', start: new Date() }
  ];
  bookedAppointments: any;
  viewDate: Date;
  participantList: any;
  practitionerList: any;
  selectedClientId: string;
  selectedParticipant = new FormControl();
  selectedPractitionerId: string;
  selectedPractitioner = new FormControl ();
  participantOptions : any;
  filteredOptions: Observable<string[]>;
  practitionerOptions: any;
  filteredPractitionerOptions:  Observable<string[]>;
  bgColor: string;
  dialogOpen: any;
  loggedInUser: any;
  loggedInUserRole: string;
  polling: any;

  constructor(private dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private store: Store<AppState>,
		private activatedRoute: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
		private auth: AuthService,
		private appointmentService: AppointmentService,
		private practitionerService: PractitionerService,
    private participantService: ParticipantService

  ) {
    this.store.pipe(select(currentUser)).subscribe((response) => {
      this.loggedInUser = response;
      this.loggedInUserRole = this.loggedInUser.role;

    })
  }

	ngOnInit() {
    this.subheaderService.setTitle('Appointments');
    if(this.loggedInUser.role == "User"){
      this.selectedPractitionerId= this.loggedInUser.userId;
      // this.selectedPractitioner = this.loggedInUser.fullName;
      
      // let loggedInPractioner = {
      //   text: "neelam therapist",
      //   id: "eb6f7095-941d-4bfd-88a5-97e9b7d8ae83",
      // }
      // this.selectedPractitioner.setValue(loggedInPractioner);
      // console.log("selected praactitoner", this.selectedPractitioner);
      // this.selectedPractitioner = this.selectedPractitioner;
    }
    this.loadParticipants();
    this.loadPractitioner();
   this.polling =  setInterval(() => {
      this.pollingForLateAppointments();
    }, 120000);
   
  }

  ngOnDestroy(){
    clearInterval(this.polling);
  }

  private filter(value: string): string[] {
    const filterValue = value;
    if(value == ""){
      this.selectedClientId = "";
      let calendarView = this.calendarComponent.getApi();
      this.handleDatesRender(calendarView);
    }
    return this.participantOptions.filter(participantOption =>
      (participantOption.text).toLowerCase().includes(filterValue));
  }

  private filterPractitoner(value: string): string[] {
    const filterValue = value;
    if(value == ""){
      this.selectedPractitionerId = "";
      let calendarView = this.calendarComponent.getApi();
      this.handleDatesRender(calendarView);
    }
    return this.practitionerOptions.filter(practitionerOption =>
       (practitionerOption.text).toLowerCase().includes(filterValue)
    );
  }


 	createAppointment(date, time) {
		const newAppointment = new Appointment();
		newAppointment.clear(); // Set all defaults fields

		const _saveMessage = `Appointment successfully has been created.`;
		const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, { data: { appointmentId: newAppointment.id, date: date, time: time, apptDuration: "", calendarView: "" } });

		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
      this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 3000, true, true);
      // this.calendarComponent.getApi().rerenderEvents();
      let calendarView = this.calendarComponent.getApi();
      
          this.handleDatesRender(calendarView);
		});
  }




  handleDateClick(arg){
    // const newAppointment = new Appointment();
    // newAppointment.clear(); // Set all defaults fields
		const _saveMessage = `Appointment successfully has been created.`;
		const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, { data: { date:arg.date } });

		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
      this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 10000, true, true);
      let calendarView = this.calendarComponent.getApi();
          this.handleDatesRender(calendarView);
		});
  }


  loadAppointments(appointmentParams) {
		let queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		// this.store.dispatch(new AppointmentsPageRequested({ page: queryParams, appointmentParams: appointmentParams   }));
		// this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
		// 	// if (res.items.length == 0) {
		// 	// 	return;
    // 	// }
    // let events = [{
    //   daysOfWeek: [ '0','1','2','4','6' ], // these recurrent events move separately
    //   startTime: '11:00:00',
    //   endTime: '11:30:00',
    //   color: 'red',
    //   startRecur:"2020-05-27T12:30:00Z",
    //   endRecur: "2020-06-09T12:30:00Z"
    // }]
    // this.calendarEvents = events;
    this.appointmentService.findAppointments(queryParams,appointmentParams).subscribe(res=>{
      this.bookedAppointments = res.data;
      let currentTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

			if (this.bookedAppointments && this.bookedAppointments) {
        this.calendarEvents =  this.bookedAppointments.map(appointmentlist =>{
          let formattedStartTime = moment(appointmentlist.startTime).format();
          let appointmentDelayTime  = moment(formattedStartTime).add(20, 'minutes');
          let appointmentDelayTimeFormatted = moment(appointmentDelayTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
          appointmentlist.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isAfter(currentTime) ? this.bgColor = "#408fc4": appointmentlist.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isBefore(currentTime) ? this.bgColor = "red" :appointmentlist.appointmentStatus=="CheckedIn"?this.bgColor ="#4fd67c":appointmentlist.appointmentStatus=="CheckedOut"?this.bgColor ="#ffbf00":this.bgColor = "#969696";
          return {
            title: appointmentlist.practitionerName,
            start: appointmentlist.startTime,
            textColor: "white",
            backgroundColor: this.bgColor,
            borderColor: this.bgColor,
            events: {
             appointment: appointmentlist
            },
          }
        })
        this.calendarComponent.getApi().addEventSource( this.calendarEvents);
      }
    })

  }

  filterConfiguration(): any {
		const filter: any = {};
		return filter;
  }

  eventClick(arg){
    let appointmentStatus = arg.event._def.extendedProps.events.appointment.appointmentStatus;
    let event = arg.event._def.extendedProps.events.appointment;
    if(appointmentStatus == "Completed"){
      // this.dialogOpen = ProviderEventsComponent;
      this.dialogOpen = EventsDialogComponent;
    }else{
      this.dialogOpen = EventsDialogCheckinComponent;
      }
      const dialogRefEvenet = this.dialog.open(this.dialogOpen, {
        width: "650px",
        data: { eventDetails: event }
      });
      dialogRefEvenet.afterClosed().subscribe(res => {
        if(res && res.appointmentId){
          let id = res.appointmentId;
        this.router.navigate(['../appointment-details', id], {
          relativeTo: this.activatedRoute
        });
      }
        if(res && res.isEdit || res == undefined){
          let calendarView = this.calendarComponent.getApi();
          this.handleDatesRender(calendarView);
        }
      });
  }


  handleDatesRender(event){
      let appointmentParams= {
      StartDate : event.view.currentStart,
      EndDate : event.view.currentEnd,
      PractitionerId:  this.selectedPractitionerId ? this.selectedPractitionerId : "",
      ParticipantId: this.selectedClientId ? this.selectedClientId : ""
    }
    this.loadAppointments(appointmentParams);
  }

  calendarEventRender(info){
    info.el.innerHTML = `${info.el.innerHTML} <div class = "fc-client-content"> <span class = "fc-client">Client :</span> <span class="fc-client-name">${info.event.extendedProps.events.appointment.patientName}</span></div>`;
  }

  loadParticipants() {
    this.participantService.listParticipant().subscribe(res=>{
      this.participantList = res;
      this.participantList.splice(0,0,{text:"All Clients"})
      this.participantOptions = this.participantList.map(participant =>{
        return participant;
      })
      this.filteredOptions = this.selectedParticipant.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
    })
  }

  loadPractitioner(){
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
    );
    this.practitionerService.findPractitioner(queryParams).subscribe(res=>{
      this.practitionerList = res;
      this.practitionerList.splice(0,0,{text:"All Practitioners"})
    this.practitionerOptions = this.practitionerList.map(practitioner =>{
      return practitioner;
    })
    this.filteredPractitionerOptions = this.selectedPractitioner.valueChanges
      .pipe(
        startWith(this.selectedPractitionerId),
        map(value => this.filterPractitoner(value))
      );
    });

}

  clientSelected(event){
    this.selectedParticipant.setValue(event.option.value.text);
    this.selectedClientId = event.option.value.id;
      // this.matForm.classList.remove('mat-focused' );
    let calendarView = this.calendarComponent.getApi();
    this.handleDatesRender(calendarView);
  }

  practitionerSelected(event){
    this.selectedPractitioner.setValue(event.option.value.text);
    this.selectedPractitionerId = event.option.value.id;
    let calendarView = this.calendarComponent.getApi();
     this.handleDatesRender(calendarView);
  }


  clientInputClick(){
    this.selectedParticipant.setValue("");
  }
  practitionerInputClick(){
    this.selectedPractitioner.setValue("");
  }

  goToTimeline(){
    this.router.navigate(["../timeline"], {
			relativeTo: this.activatedRoute
    })
  }

  goToTimeGrid(){
    this.router.navigate(["../timegrid"], {
			relativeTo: this.activatedRoute
    })
   }

   goToCalendar(){
    this.router.navigate(["../view"], {
			relativeTo: this.activatedRoute
    })
   }

   pollingForLateAppointments(){
    let currentTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    if (this.bookedAppointments && this.bookedAppointments) {
      this.calendarEvents =  this.bookedAppointments.map(appointmentlist =>{
        let formattedStartTime = moment(appointmentlist.startTime).format();
        let appointmentDelayTime  = moment(formattedStartTime).add(20, 'minutes');
        let appointmentDelayTimeFormatted = moment(appointmentDelayTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
        appointmentlist.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isAfter(currentTime) ? this.bgColor = "#408fc4": appointmentlist.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isBefore(currentTime) ? this.bgColor = "red" :appointmentlist.appointmentStatus=="CheckedIn"?this.bgColor ="#4fd67c":appointmentlist.appointmentStatus=="CheckedOut"?this.bgColor ="#ffbf00":this.bgColor = "#969696";
        return {
          title: appointmentlist.practitionerName,
          start: appointmentlist.startTime,
          textColor: "white",
          backgroundColor: this.bgColor,
          borderColor: this.bgColor,
          events: {
           appointment: appointmentlist
          },
        }
      })
      let calendarApi = this.calendarComponent.getApi();
      calendarApi.addEventSource( this.calendarEvents);
    }
   }
}
