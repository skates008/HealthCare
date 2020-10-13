import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Store, select } from '@ngrx/store';
import interactionPlugin from '@fullcalendar/interaction';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatAutocompleteTrigger } from '@angular/material';

import {
  TeamsPageRequested, selectTeamsInStore, Appointment, GridViewAppointmentList, selectQueryResultAppointment
} from './../../../core/auth';
import { AuthService, TherapyServicesService, PractitionerService, AppointmentService } from './../../../core/_services';
import { QueryParamsModel, LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { AppState } from './../../../core/reducers';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import moment from 'moment';
import { ProviderEventsComponent } from '../events/events.component';
import { ProviderAppointmentsAddComponent } from '../appointments-add/appointments-add.component';
import { EventsDialogComponent } from '../events-dialog/events-dialog.component';
import { EventsDialogCheckinComponent } from '../events-dialog-checkin/events-dialog-checkin.component';

@Component({
  selector: 'kt-appointment-timegrid',
  templateUrl: './appointment-timegrid.component.html',
  styleUrls: ['./appointment-timegrid.component.scss']
})
export class AppointmentTimegridComponent implements OnInit, OnDestroy {

  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent; // the #calendar in the template
  plugins = [resourceTimeGridPlugin, interactionPlugin]
  defaultView: 'resourceTimeGridDay'
  resources: any = [];
  calendarEvents: any = [];
  resourcesList: any;
  eventsList: any = [];
  teamList: any;
  teamOptions: any;
  selectedTeam = new FormControl();
  filteredTeamOptions: Observable<string[]>;
  selectedTeamID: string;
  practitionerList: any;
  practitionerOptions: any;
  filteredPractitionerOptions: Observable<string[]>;
  selectedPractitionerId: string;
  selectedPractitioner = new FormControl();
  viewDate: any;
  selectedDate = new FormControl();
  appointmentDetails: any;
  dialogOpen: any;
  bgColor: string;
  polling: any;

  constructor(
    private auth: AuthService,
    private therapy: TherapyServicesService,
    private practitioner: PractitionerService,
    private appointment: AppointmentService,
    private store: Store<AppState>,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.loadTeams();
    this.loadPractitioner();
    this.polling = setInterval(() => {
      this.pollingForLateAppointments();
    }, 120000);
  }

  ngOnDestroy() {
    clearInterval(this.polling);
  }


  loadResources(params) {
    let currentTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSS");
    // this.store.dispatch(new GridViewAppointmentList({params: params}));
		// this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
    this.therapy.loadTherapistAppointments(params).subscribe(result => {
      // if(res.data.length > 0){
      this.resourcesList = result.data;
      if(this.resourcesList.length == 0){
        return;
      }
      this.resources = this.resourcesList && this.resourcesList.map(res => {
        return {
          title: res.name,
          id: res.id
        }
      })

      this.calendarEvents = [];
      for (let data of this.resourcesList) {
        if (data.events) {
          for (let event of data.events) {
            let formattedStartTime = moment(event.startTime).format();
            let appointmentDelayTime = moment(formattedStartTime).add(20, 'minutes');
            let appointmentDelayTimeFormatted = moment(appointmentDelayTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
            event.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isAfter(currentTime) ? this.bgColor = "#408fc4" : event.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isBefore(currentTime) ? this.bgColor = "red" : event.appointmentStatus == "CheckedIn" ? this.bgColor = "#4fd67c" : event.appointmentStatus == "CheckedOut" ? this.bgColor = "#ffbf00" : this.bgColor = "#969696";
            let eventDetails = {
              id: event.id,
              title: event.practitionerName,
              start: event.startTime,
              end: event.endTime,
              textColor: 'white',
              backgroundColor: this.bgColor,
              borderColor: this.bgColor,
              resourceId: event.practitionerId,
              events: {
                appointment: event
              }
            }
            this.calendarEvents.push(eventDetails);
          }
        }
      }
            this.calendarComponent.getApi().addEventSource(this.calendarEvents);

    // }

    //   setTimeout(() => {
    //     let calendarView = this.calendarComponent.getApi();
    //     this.handleDatesRender(calendarView);
    //   }, 5000);
    //   this.calendarComponent.getApi().addEventSource(this.calendarEvents);

    //   // var element = document.getElementsByClassName('kt-menu__item--active');
    //   // for(var i = 0; i < element.length; i++)
    //   // {
    //   //     // element[i].className += "classtobeadded";
    //   //     console.log("element iii", element[i]);
    //   //     // element[i].classList.add("kt-menu__item--hover");
    //   //     var menuItem = element[i] as HTMLElement;
    //   //     menuItem.focus();
    //   //     // console.log(menuItem.childNodes[1], "childnodes");
    //   //     // menuItem.childNodes[1].click();
    //   // }
    //   // let calendarView = this.calendarComponent.getApi();
    //   // this.handleDatesRender(calendarView);
    // })
    })
  }



  handleDatesRender(event) {
    this.selectedDate.setValue(event.view.currentStart);
    let params = {
      StartDate: event.view.currentStart,
      EndDate: event.view.currentEnd,
      PractitionerId: this.selectedPractitionerId ? this.selectedPractitionerId : "",
      TeamId: this.selectedTeamID ? this.selectedTeamID : "",
    }
    this.loadResources(params);
  }

  calendarEventRender(info) {
    info.el.innerHTML = `${info.el.innerHTML} <div class = "fc-client-content"> <span class = "fc-client">Client :</span> <span class="fc-client-name">${info.event.extendedProps.events.appointment.patientName}</span></div>`;
  }

  loadTeams() {
    let queryParams = new QueryParamsModel(
      this.filterConfiguration(),
    );
    this.store.dispatch(new TeamsPageRequested({ page: queryParams }));
    this.store.pipe(select(selectTeamsInStore)).subscribe(res => {

      if (res.total == 0) {
        return;
      }
      this.teamList = res.data;
      this.teamList.splice(0, 0, { name: "All Teams" });
      this.teamOptions = this.teamList.map(team => {
        return team;
      })
      this.filteredTeamOptions = this.selectedTeam.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    })
  }

  private _filter(value: string): string[] {
    // const filterValue = value;
    // if(value == ""){
    //   // this.selectedClientId = "";
    //   // let calendarView = this.calendarComponent.getApi();
    //   // this.handleDatesRender(calendarView);
    // }
    // return this.teamOptions.filter(teamOption =>
    //   (teamOption.name).toLowerCase().includes(filterValue));


    const filterValue = value;
    if (value == "") {
      // this.selectedTeamID = "";
      // let calendarView = this.calendarComponent.getApi();
      // this.handleDatesRender(calendarView);
    }
    return this.teamOptions.filter(teamOption =>
      (teamOption.name).toLowerCase().includes(filterValue)
    );
  }

  teamSelected(event) {
    this.selectedTeam.setValue(event.option.value.name);
    this.selectedTeamID = event.option.value.id;
    this.selectedPractitioner.setValue("");
    this.loadPractitionerWithTeam(this.selectedTeamID);
    let calendarView = this.calendarComponent.getApi();
    this.handleDatesRender(calendarView);
  }

  loadPractitionerWithTeam(teamId) {
    this.practitioner.findPractitionerWithTeam(teamId).subscribe(res => {
      // if (res.length == 0) {
      //   return;
      // }
      this.practitionerList = res;
      this.practitionerOptions = this.practitionerList.map(practitioner => {
        return practitioner;
      })
      this.filteredPractitionerOptions = this.selectedPractitioner.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterPractitoner(value))
        );

    })
  }

  goToTimeline() {
    this.router.navigate(["../timeline"], {
      relativeTo: this.activatedRoute
    })
  }

  goToCalendar() {
    this.router.navigate(["../view"], {
      relativeTo: this.activatedRoute
    })
  }

  loadPractitioner() {
    let queryParams = new QueryParamsModel(
      this.filterConfiguration(),
    );
    this.practitioner.findPractitioner(queryParams).subscribe(res => {
      this.practitionerList = res;
      this.practitionerList.splice(0, 0, { text: "All Practitioners" });
      this.practitionerOptions = this.practitionerList.map(practitioner => {
        return practitioner;
      })
      this.filteredPractitionerOptions = this.selectedPractitioner.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterPractitoner(value))
        );
    });
  }


  private _filterPractitoner(value: string): string[] {
    const filterValue = value;
    if (value == "") {
      this.selectedPractitionerId = "";
      let calendarView = this.calendarComponent.getApi();
      this.handleDatesRender(calendarView);
    }
    return this.practitionerOptions.filter(practitionerOption =>
      (practitionerOption.text).toLowerCase().includes(filterValue)
    );
  }


  practitionerSelected(event) {
    this.selectedPractitioner.setValue(event.option.value.text);
    this.selectedPractitionerId = event.option.value.id;
    let calendarView = this.calendarComponent.getApi();
    this.handleDatesRender(calendarView);
  }


  practitionerInputClick() {
    this.selectedPractitioner.setValue("");
    if (this.selectedTeamID == "" || this.selectedTeamID == undefined) {
      this.loadPractitioner();
    } else {
      this.loadPractitionerWithTeam(this.selectedTeamID);
    }
  }

  teamInputClick() {
    this.selectedTeam.setValue("");
    this.selectedTeamID = "";
    let calendarView = this.calendarComponent.getApi();
    this.handleDatesRender(calendarView);
  }


  filterConfiguration(): any {
    const filter: any = {};
    return filter;
  }

  public viewDateChange(event): void {
    this.selectedDate.setValue(event.target.value);
    this.viewDate = new Date(event.target.value);
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.viewDate); // call a method on the Calendar object
  }

  handleEventDrop(data) {
    this.appointmentDetails = data.event.extendedProps.events.appointment;
    if (this.appointmentDetails.appointmentStatus != "Confirmed") {
      data.revert();
      this.toastr.error("Reschedule denied for this appointment", 'Error', {
        timeOut: 3000
      });
      return;
    }
    const _appointment = new Appointment();
    _appointment.clear();
    _appointment.id = this.appointmentDetails.id;
    _appointment.practitionerId = data.newResource == null ? this.appointmentDetails.practitionerId : data.newResource.id;
    _appointment.location = this.appointmentDetails.address.address;
    _appointment.address = this.appointmentDetails.address;
    _appointment.patientId = this.appointmentDetails.patientId;
    // _appointment.addressType = this.appointmentDetails.address.addressType;
    _appointment.AppointmentTypeId = this.appointmentDetails.appointmentTypeId;
    _appointment.startTime = moment(data.event.start).format('YYYY-MM-DDTHH:mm:ss.SSS');
    _appointment.endTime = moment(data.event.end).format('YYYY-MM-DDTHH:mm:ss.SSS');
    _appointment.appointmentDate = moment(data.event.start).format('YYYY-MM-DDTHH:mm:ss.SSS');
    _appointment.note = this.appointmentDetails.note;
    this.appointment.updateAppointment(_appointment).subscribe(res => {

      if (res.success) {
        this.toastr.success("Appointment rescheduled successfully", 'Success', {
          timeOut: 3000
        });
        let calendarView = this.calendarComponent.getApi();
        this.handleDatesRender(calendarView);
      } else {
        this.toastr.error("Something went wrong.Please rescheduled again", 'Error', {
          timeOut: 3000
        });
      }
    })
  }

  eventClick(arg) {
    let appointmentStatus = arg.event._def.extendedProps.events.appointment.appointmentStatus;
    let event = arg.event._def.extendedProps.events.appointment;
    if (appointmentStatus == "Completed") {
      // this.dialogOpen = ProviderEventsComponent;
      this.dialogOpen = EventsDialogComponent;
    } else {
      this.dialogOpen = EventsDialogCheckinComponent;
    }
    const dialogRefEvenet = this.dialog.open(this.dialogOpen, {
      width: "650px",
      data: { eventDetails: event }
    });
    dialogRefEvenet.afterClosed().subscribe(res => {
      if (res && res.appointmentId) {
        let id = res.appointmentId;
        this.router.navigate(['../appointment-details', id], {
          relativeTo: this.activatedRoute
        });
      }
      if (res && res.isEdit || res == undefined) {
        let calendarView = this.calendarComponent.getApi();
        this.handleDatesRender(calendarView);
      }
    });
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
      this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 10000, true, true);
      // this.calendarComponent.getApi().rerenderEvents();
      let calendarView = this.calendarComponent.getApi();
      this.handleDatesRender(calendarView);
    });
  }

  handleDateClick(arg) {
    const _saveMessage = `Appointment successfully has been created.`;
    const practitionerDetails = [{
      id: arg.resource.id,
      text: arg.resource.title
    }]
    const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, { data: { date: arg.date, practitioner: practitionerDetails } });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 10000, true, true);
      let calendarView = this.calendarComponent.getApi();
      this.handleDatesRender(calendarView);
    });
  }

  pollingForLateAppointments() {
    let currentTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.calendarEvents = [];
    for (let data of this.resourcesList) {
      if (data.events) {

        for (let event of data.events) {
          let formattedStartTime = moment(event.startTime).format();
          let appointmentDelayTime = moment(formattedStartTime).add(20, 'minutes');
          let appointmentDelayTimeFormatted = moment(appointmentDelayTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
          event.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isAfter(currentTime) ? this.bgColor = "#408fc4" : event.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isBefore(currentTime) ? this.bgColor = "red" : event.appointmentStatus == "CheckedIn" ? this.bgColor = "#4fd67c" : event.appointmentStatus == "CheckedOut" ? this.bgColor = "#ffbf00" : this.bgColor = "#969696";
          let eventDetails = {
            id: event.id,
            title: event.practitionerName,
            start: event.startTime,
            end: event.endTime,
            textColor: 'white',
            backgroundColor: this.bgColor,
            borderColor: this.bgColor,
            resourceId: event.practitionerId,
            events: {
              appointment: event
            }
          }
          this.calendarEvents.push(eventDetails);
        }
      }
    }
    this.calendarComponent.getApi().addEventSource(this.calendarEvents);
  }


}
