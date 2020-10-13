import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { LayoutUtilsService, MessageType } from '.././../../../core/_base/crud';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { AppointmentsAddComponent } from "../../appointments-add/appointments-add.component";
import { Store, select } from '@ngrx/store';
import { AppState } from '.././../../../core/reducers';
import { AppointmentDeleted, AppointmentArchived, Appointment, AssessmentAdded, ObservationAdded, selectQueryResultAppointment, AppointmentsPageRequested, Note, NoteOnServerCreated, selectLastCreatedNoteId } from '.././../../../core/auth';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { StringNullableChain } from 'lodash';
import { QueryParamsModel } from '.././../../../core/_base/crud';



@Component({
  selector: 'kt-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  @ViewChild('arrivedDetails', { static: true }) arrivedDetails: TemplateRef<any>; // Note: TemplateRef requires a type parameter for the component reference. In this case, we're passing an `any` type as it's not a component.

  eventDetails: any;
  timeDuration: any;
  hours: any;
  duration: any;
  appointmentInterval: any;
  formattedStarttime: any;
  appointment: Appointment;
  showCancelApptDialog: boolean = false;
  showFinishApptDialog: boolean = false;
  cancelReasons: string[] = ['Feeling Better', 'Condition Worse', 'Sick', 'Away', 'Work', 'Other'];
  cancelReason: string;
  cancelNotes: string = "";
  apptClientSay: string;
  apptDo: string;
  apptFeedback: string;
  
  archiveStatus: string;
  arrivalStatus: string;
  dialogheaderTitle: string;
  addApptDetails: string;
  observationDetails: string;
  assessmentDetails: string;
  treatmentNote: string;
  dialogAddObservation: any;
  queryParams: any;
  updatedAppt: any;
  filteredappt: any;
  Status: string;
  apptStartDate: Date;
  apptEndDate: Date;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;


  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EventsComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.arrivalStatus = "";
    this.eventDetails = this.data.eventDetails;

    let starthour = ((moment(this.eventDetails.starttime, 'hh:mm A').format('HH:mm')).split(":"))[0];
    let startmin = ((moment(this.eventDetails.starttime, 'hh:mm A').format('HH:mm')).split(":"))[1];
    let endhour = ((moment(this.eventDetails.endtime, 'hh:mm A').format('HH:mm')).split(":"))[0];
    let endmin = ((moment(this.eventDetails.endtime, 'hh:mm A').format('HH:mm')).split(":"))[1];
    const formattedStarttime = (moment(this.eventDetails.date)).set({ hour: parseInt(starthour, 10), minute: parseInt(startmin, 10) }).toDate();
    const formattedEndtime = (moment(this.eventDetails.date)).set({ hour: parseInt(endhour, 10), minute: parseInt(endmin, 10) }).toDate();

    this.apptStartDate = formattedStarttime;
    this.apptEndDate = formattedEndtime;
    this.duration = moment.duration(moment(this.apptEndDate, 'HH:mm').diff(moment(this.apptStartDate, 'HH:mm')));
    this.hours = parseInt(this.duration.asHours());
    const minutes = parseInt(this.duration.asMinutes()) - this.hours * 60;

    this.appointmentInterval = (minutes > 0) ? (this.hours + ' hour and ' + minutes + ' minutes.') : this.hours + ' hour';
    this.formattedStarttime = moment(this.apptStartDate).format("hh:mm A");
  }

  editAppointment(appointment) {
    const dialogRef = this.dialog.open(AppointmentsAddComponent, { data: { appointmentId: appointment.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close({
        isEdit: true
      });
    });
  }

  showCancelAppointment() {
    this.showCancelApptDialog = true;
  }

  showFinishAppointment() {
    this.showFinishApptDialog = true;
  }

  archiveAppointment(appointment, status) {
    if (status == "cancel") {
      this.archiveStatus = "cancelled";
    } else {
      this.archiveStatus = "expired";

    }
    const _title: string = 'Appointment';
    const _description: string = 'Are you sure to cancel this appointment?';
    const _waitDesciption: string = 'Appointment Cancelling...';
    const _deleteMessage = `Appointment has been cancelled`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close({
        isEdit: true
      });
      this.store.dispatch(new AppointmentDeleted({ id: appointment.id }));
      this.store.dispatch(new AppointmentArchived({
        appointment: {
          ...appointment,
          status: this.archiveStatus,
          cancelDetails: {
            cancelReason: this.cancelReason,
            cancelNotes: this.cancelNotes
          }
        }
      }));
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  }

  FinaliseAppointment(appointment, status) {
    if (status == "cancel") {
      this.Status = "checkedout";
    }
    
    const _title: string = ' Appointment';
    const _description: string = 'Are you sure to finilize this appointment?';
    const _waitDesciption: string = 'Appointment Finishing...';
    const _deleteMessage = `Appointment has been finishing`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close({
        isEdit: true
      });
      this.store.dispatch(new AppointmentDeleted({ id: appointment.id }));
      this.router.navigate(["../../invoices/invoices/add"], {
        state: {
          participant: [this.eventDetails.participant],
          practitioner: this.eventDetails.practitioner,
          date: this.eventDetails.date
        }
      });
      this.store.dispatch(new AppointmentArchived({
        appointment: {
          ...appointment,
          status: this.archiveStatus,
          cancelDetails: {
            apptClientSay: this.apptClientSay,
            apptDo: this.apptDo,
            apptFeedback: this.apptFeedback
          }
        }
      }));
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  }

  bookAppointment() {
    const dialogRefBookAppt = this.dialog.open(AppointmentsAddComponent, { data: { bookAppointment: "create Appointment" } });
    dialogRefBookAppt.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close({
        isCreatedFromEvent: true
      });
    });
  }

  rescheduleAppointment(appointment) {
    const dialogRef = this.dialog.open(AppointmentsAddComponent, { data: { appointmentId: appointment.id, reschedule: true } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close({
        isEdit: true
      });
    });

  }

  radioChange(e) {
    this.cancelReason = e.value;
  }

  openInvoice(eventDetails) {
    this.dialogRef.close({
    });

    this.router.navigate(["../../invoices/invoices/add"], {
      state: {
        participant: [eventDetails.participant],
        practitioner: eventDetails.practitioner,
        date: eventDetails.date
      }
    });
  }

  addParticipantStatus(addeddata) {
    this.addApptDetails = "";
    if (addeddata == "observation") {
      this.dialogheaderTitle = "Add Observation";
    }
    else if (addeddata == "assessment") {
      this.dialogheaderTitle = "Add Assessment";
    } else if (addeddata == "treatment") {
      this.dialogheaderTitle = "Add Treatment Note";

    }
    const _saveMessage = `Note successfully has been added.`;
    this.dialogAddObservation = this.dialog.open(this.arrivedDetails, {
      width: '500px',
    });

    this.dialogAddObservation.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Create, 10000, true, true);
    });
  }

  addApptDetailsfunc(appointment, key) {
    this.queryParams = new QueryParamsModel(
      this.filterConfiguration(),
    );
    const _note = new Note();
    _note.clear();
    _note.appointmentId = appointment.id;
    _note.practitioner = appointment.practitioner;
    _note.appointmentDate = appointment.date;
    _note.participant_id = appointment.participant.id;
    if (key == "Add Observation") {
      _note.observation = this.addApptDetails;
      _note.type = "observation";
    } else if (key == "Add Assessment") {
      _note.assessment = this.addApptDetails;
      _note.type = "assessment";
    } else if (key == "Add Treatment") {
      _note.assessment = this.addApptDetails;
      _note.type = "treatment";
    }
    this.store.dispatch(new NoteOnServerCreated({ note: _note }));
    const addSubscription = this.store.pipe(select(selectLastCreatedNoteId)).subscribe(newId => {
      if (!newId) {
        return;
      }
      this.dialogAddObservation.close({
      });
    });
  }

  filterConfiguration(): any {
    const filter: any = {};
    return filter;
  }




}