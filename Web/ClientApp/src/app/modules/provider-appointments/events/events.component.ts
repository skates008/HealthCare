import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { ProviderAppointmentsAddComponent } from "./../appointments-add/appointments-add.component";
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { AppointmentDeleted, AppointmentArchived, Appointment, AssessmentAdded, ObservationAdded, selectQueryResultAppointment,AppointmentsPageRequested, Note, NoteOnServerCreated, selectLastCreatedNoteId,AppointmentCancelled, AppointmentFinalize, AppointmentNoteOnServerCreated, selectLastCreatedAppointmentId} from './../../../core/auth';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { StringNullableChain } from 'lodash';
import { QueryParamsModel } from './../../../core/_base/crud';
import { min } from 'date-fns';
import { AuthService, AppointmentService } from './../../../core/_services';


@Component({
  selector: 'kt-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class ProviderEventsComponent implements OnInit {
  @ViewChild('arrivedDetails', { static: true }) arrivedDetails: TemplateRef<any>; // Note: TemplateRef requires a type parameter for the component reference. In this case, we're passing an `any` type as it's not a component.

  eventDetails: any;
  timeDuration: any;
  hours: any;
  duration: any;
  appointmentInterval: any;
  formattedStarttime: any;
  appointment: Appointment;
  passAppt: boolean = false;
  showCancelApptDialog: boolean = false;
  showFinishApptDialog: boolean = false;
  hidefooter: boolean = false;
  cancelReasons: string[] = ['Feeling Better', 'Condition Worse', 'Sick', 'Away', 'Work', 'Other'];
  cancelReason: string = "";
  cancelNotes: string = "";
  apptClientSay: string = "";
  apptDo: string = "";
  apptFeedback: string = "";
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
  notArrivedApptFinish: boolean = false;
  notArrivedReason: string;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  formattedEndtime: any;
  minutes: any;


  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ProviderEventsComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private appointmentService: AppointmentService
  ) {

  }

  ngOnInit() {
    this.arrivalStatus = "";
    this.eventDetails = this.data.eventDetails;
    this.formattedStarttime = moment(this.data.eventDetails.startTime).format("hh:mm A");
     const startTime = moment(this.data.eventDetails.startTime).format("DD/MM/YYYY HH:mm:ss");
    const endTime = moment(this.data.eventDetails.endTime).format("DD/MM/YYYY HH:mm:ss");
    const diff =  moment(endTime, "DD/MM/YYYY HH:mm:ss").diff(moment(startTime, "DD/MM/YYYY HH:mm:ss"));
    this.duration = moment.duration(diff);
    this.hours = parseInt(this.duration.asHours());
    if(this.hours > 0){
     this.minutes = parseInt(this.duration.asMinutes()) - this.hours * 60;
    }else{
      this.minutes = parseInt(this.duration.asMinutes());

    }
    this.appointmentInterval = (this.hours > 0 && this.minutes > 0) ? (this.hours + ' hour and ' + this.minutes + ' minutes.') : (this.hours >0 && this.minutes == 0)?this.hours + ' hour' : this.minutes + 'minutes';

  }

  editAppointment(appointment) {
    const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, { data: { appointment: appointment} });
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
    this.hidefooter = true;
  }

  showFinishAppointment(arrivalStatus) {
    arrivalStatus == "arrived" ? this.showFinishApptDialog = true : this.showFinishApptDialog = false;
    if (arrivalStatus = "arrived" && this.notArrivedReason == "noshow") {
      this.dialogRef.close();

    }
  }


  cancelAppointment(appointment){
    const _title: string = 'Appointment';
    const _description: string = 'Are you sure you want to cancel this appointment?';
    const _waitDesciption: string = 'Appointment Cancelling...';
    const _deleteMessage = `Appointment has been cancelled`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      let id = appointment.id;
      let cancelData = {
        Action: 4,
         cancelAppointmentReason: this.cancelReason,
         cancelNotes: this.cancelNotes
        }
      this.appointmentService.cancelAppointment(id, cancelData).subscribe(res=>{
        if(res.success){
          this.dialogRef.close({
            isEdit: true
          });
        }
      })
    });
  }

  finaliseAppointment(appointment, status) {
      this.dialogRef.close();
      let id = appointment.id;
      let finalizeData ={
        clientSay: this.apptClientSay,
        youDo: this.apptDo,
        feedback: this.apptFeedback,
        action: 5,
        status: 1
    }
      this.appointmentService.finalizeAppointment(id, finalizeData).subscribe(res=>{
        if(res.success){
          const appointmentDetails = {
            participantId: this.eventDetails.patientId,
            practitionerId: this.eventDetails.practitionerId,
            practitioner: this.eventDetails.practitionerName,
            appointmentId : appointment.id,
            prefferedName: this.eventDetails.patientName,
            startTime: this.eventDetails.startTime,
            endTime: this.eventDetails.endTime
          }
          this.router.navigate(["../../times/timeEntry/add"], {
            state: {
              appointmentDetails
            }
          });
        }

      })

      // })
  }

  bookAppointment() {
    const dialogRefBookAppt = this.dialog.open(ProviderAppointmentsAddComponent, { data: { bookAppointment: "create Appointment" } });
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
    const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, {
      data: { appointment: appointment, reschedule: true }
    });
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

  notArrivedRadio(e) {
    this.notArrivedReason = e.value;
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
    if (key == "Add Observation") {
      _note.text = this.addApptDetails;
      _note.type = "observation";
    } else if (key == "Add Assessment") {
      _note.text = this.addApptDetails;
      _note.type = "assessment";
    } else if (key == "Add Treatment Note") {
      _note.text = this.addApptDetails;
      _note.type = "treatmentNote";
    }
    this.store.dispatch(new AppointmentNoteOnServerCreated({ note: _note }));
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

  closeDialogBox() {
    this.dialogRef.close();
  }

  hideCancelApptDialog() {
    this.showCancelApptDialog = false;
    this.hidefooter = false;
  }

  closeNotesDialog() {
    this.dialogAddObservation.close();
  }

  finalizeFormValid(): boolean {
     return (this.apptClientSay != "" && this.apptDo != "" && this.apptFeedback != "");
  }

  cancelFormValid(): boolean {
    return (this.cancelReason != "" );
 }


}
