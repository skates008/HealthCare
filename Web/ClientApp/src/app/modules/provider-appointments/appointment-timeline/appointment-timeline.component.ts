import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import {
  TeamUserListRequested, selectTeamsInStore, TeamsPageRequested, Appointment
} from './../../../core/auth';
import { AuthService, TeamService, AppointmentService } from './../../../core/_services';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { QueryParamsModel, LayoutUtilsService } from './../../../core/_base/crud';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderEventsComponent } from '../events/events.component';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatAutocompleteTrigger } from '@angular/material';
import { ProviderAppointmentsAddComponent } from '../appointments-add/appointments-add.component';
import { EventsDialogComponent } from '../events-dialog/events-dialog.component';
import { EventsDialogCheckinComponent } from '../events-dialog-checkin/events-dialog-checkin.component';
import moment from 'moment';


@Component({
  selector: 'kt-appointment-timeline',
  templateUrl: './appointment-timeline.component.html',
  styleUrls: ['./appointment-timeline.component.scss']
})
export class AppointmentTimelineComponent implements OnInit, OnDestroy {

  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent; // the #calendar in the template
  plugins = [resourceTimelinePlugin]
  defaultView = 'resourceTimeline';
  resources: any = [];
  calendarEvents: any = [];
  eventList: any;
  teamList: any;
  teamOptions: any;
  selectedTeam = new FormControl();
  filteredTeamOptions: Observable<string[]>;
  selectedTeamID: string;
  resourcesList: any;
  bgColor: string;
  dialogOpen: any;
  polling: any;

  constructor(
    private auth: AuthService,
    private team: TeamService,
    private appointment: AppointmentService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
  ) { }

  ngOnInit() {
    // this.loadResources();
    this.loadTeams();
    this.polling = setInterval(() => {
      this.pollingForLateAppointments();
    }, 120000);

  }

  ngOnDestroy() {
    clearInterval(this.polling);
  }


  handleDatesRender(event) {
    let params = {
      StartDate: event.view.currentStart,
      EndDate: event.view.currentEnd,
      TeamId: this.selectedTeamID ? this.selectedTeamID : "",
    }
    this.loadResources();
    this.loadEvents(params);
  }

  loadResources() {
    this.team.listTeamUsers().subscribe(res => {
      this.resourcesList = res.data;
      // if(this.selectedTeam.value != null ){
      //     this.resourcesList = this.resourcesList.filter(
      //       resources =>
      //         resources.id == this.selectedTeam.value
      //     )
      // }
      this.resources = this.resourcesList;
      // this.calendarComponent.getApi().addResource(this.resources);

    })
  }

  loadEvents(param) {
    let currentTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.appointment.eventsTimeline(param).subscribe(res => {
      this.eventList = [];
      this.eventList = res.data;
      this.calendarEvents = [];
      this.calendarEvents = this.eventList.map(res => {
        let formattedStartTime = moment(res.startTime).format();
        let appointmentDelayTime = moment(formattedStartTime).add(20, 'minutes');
        let appointmentDelayTimeFormatted = moment(appointmentDelayTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
        res.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isAfter(currentTime) ? this.bgColor = "#408fc4" : res.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isBefore(currentTime) ? this.bgColor = "red" : res.appointmentStatus == "CheckedIn" ? this.bgColor = "#4fd67c" : res.appointmentStatus == "CheckedOut" ? this.bgColor = "#ffbf00" : this.bgColor = "#969696";
        // res.appointmentStatus == "Confirmed" && moment(res.startTime).isBefore(lateTime) ? this.bgColor = "red": res.appointmentStatus == "Confirmed" && moment(res.startTime).isAfter(lateTime) ? this.bgColor = "#408fc4" :res.appointmentStatus=="CheckedIn"?this.bgColor ="#4fd67c":res.appointmentStatus=="CheckedOut"?this.bgColor ="#ffbf00":this.bgColor = "#969696";
        return {
          title: res.patientName,
          start: res.startTime,
          end: res.endTime,
          textColor: 'white',
          resourceId: res.resourceId,
          backgroundColor: this.bgColor,
          borderColor: this.bgColor,
          events: {
            appointment: res
          }
        }
      })
      this.calendarComponent.getApi().refetchEvents();
    })
  }

  loadTeams() {
    let queryParams = new QueryParamsModel(
      this.filterConfiguration(),
    );
    
    this.store.dispatch(new TeamsPageRequested({ page: queryParams }));
    this.store.pipe(select(selectTeamsInStore)).subscribe(res => {
      if (res.total === 0) {
        return;
      }

      this.teamList = res.data;
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

  filterConfiguration(): any {
    const filter: any = {};
    return filter;
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    if (value == "") {
      // this.selectedClientId = "";
      // let calendarView = this.calendarComponent.getApi();
      // this.handleDatesRender(calendarView);
    }
    return this.teamOptions.filter(teamOption =>
      (teamOption.name).toLowerCase().includes(filterValue));
  }

  teamSelected(event) {
    this.selectedTeam.setValue(event.option.value.name);
    this.selectedTeamID = event.option.value.id;
    let calendarView = this.calendarComponent.getApi();
    this.handleDatesRender(calendarView);
  }

  goToTimeGrid() {
    this.router.navigate(["../timegrid"], {
      relativeTo: this.activatedRoute
    })
  }

  teamInputClick() {
    this.selectedTeam.setValue(null);
    this.selectedTeamID = "";
    this.loadTeams();
    let calendarView = this.calendarComponent.getApi();
    this.handleDatesRender(calendarView);
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
      width: "600px",
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
      // if(res){
      //   let calendarView = this.calendarComponent.getApi();
      //   this.handleDatesRender(calendarView);
      // }
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
      // this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 10000, true, true);
      // this.calendarComponent.getApi().rerenderEvents();
      let calendarView = this.calendarComponent.getApi();
      this.handleDatesRender(calendarView);
    });
  }

  goToCalendar() {
    this.router.navigate(["../view"], {
      relativeTo: this.activatedRoute
    })
  }

  pollingForLateAppointments() {
    let currentTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSS");
    this.calendarEvents = this.eventList.map(res => {
      let formattedStartTime = moment(res.startTime).format();
      let appointmentDelayTime = moment(formattedStartTime).add(20, 'minutes');
      let appointmentDelayTimeFormatted = moment(appointmentDelayTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
      res.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isAfter(currentTime) ? this.bgColor = "#408fc4" : res.appointmentStatus == "Confirmed" && moment(appointmentDelayTimeFormatted).isBefore(currentTime) ? this.bgColor = "red" : res.appointmentStatus == "CheckedIn" ? this.bgColor = "#4fd67c" : res.appointmentStatus == "CheckedOut" ? this.bgColor = "#ffbf00" : this.bgColor = "#969696";
      return {
        title: res.patientName,
        start: res.startTime,
        end: res.endTime,
        textColor: 'white',
        resourceId: res.resourceId,
        backgroundColor: this.bgColor,
        borderColor: this.bgColor,
        events: {
          appointment: res
        }
      }
    })
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.refetchEvents();
  }
}
