import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Appointment, AppointmentOnServerCreated, selectLastCreatedAppointmentId, selectParticipantsInStore, ParticipantsPageRequested, selectAppointmentById, AppointmentUpdated, Notification, NotificationOnServerCreated } from './../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { LayoutUtilsService, MessageType, QueryParamsModel } from './../../../core/_base/crud';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Select2OptionData } from 'ng2-select2';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'kt-appointments-add',
  templateUrl: './appointments-add.component.html',
  styleUrls: ['./appointments-add.component.scss']
})
export class AppointmentsAddComponent implements OnInit {

  @ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;

  appointment: Appointment;
  hasFormErrors: boolean = false;
  private subscriptions: Subscription[] = [];
  appointment$: Observable<Appointment>;
  public exampleData: Array<Select2OptionData>;
  public options: Select2Options;
  meridian = true;
  startDateTime;
  currentTime: any;
  endDateTime;
  selectedDate;
  selecTimeErr: boolean = false;
  selecTimeErrText: string;
  participantList: any;
  buttonText: string;
  reschedule: boolean = false;
  headerTitle: string = "New Appointment";
  endtime: any;
  endtimeHour: any;
  endtimeMinute: any;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;

  constructor(private store: Store<AppState>,
    private layoutUtilsService: LayoutUtilsService,
    private _dialog: MatDialog,
    public dialogRef: MatDialogRef<AppointmentsAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.appointment = new Appointment;
    this.appointment.practitioner = "";
    this.appointment.type = "";
    this.data.date ? (this.appointment.date = this.data.date) : (this.appointment.date = "");
    this.data.time ? (this.appointment.starttimeObj = this.data.time.startTime) : (this.appointment.starttimeObj = "");
    this.data.time ? (this.endtime = this.data.time.endTime) : (this.endtime = "");
    if ((this.data.appointmentId && this.data.reschedule) || this.data.appointmentId) {
      this.appointment$ = this.store.pipe(select(selectAppointmentById(this.data.appointmentId)));
      this.buttonText = "Update Appointment";
      this.headerTitle = "Edit Appointment";
      if (this.data.reschedule) {
        this.reschedule = true;
        this.headerTitle = "Reschedule Appointment";
      }
    } else {
      const newAppointment = new Appointment;
      this.buttonText = "Create Appointment";
      this.appointment$ = of(newAppointment);
    }
    this.appointment$.subscribe(res => {
      if (!res.id) {
        return;
      }

      this.appointment = new Appointment();
      this.appointment.id = res.id;
      this.appointment.practitioner = res.practitioner;
      this.appointment.type = res.type;
      this.appointment.participant = res.participant;
      if (res.starttime && res.endtime) {
        this.appointment.starttimeObj = moment(res.starttime, "hh:mm A").format("HH:mm");
        this.endtime = moment(res.endtime, "hh:mm A").format("HH:mm");
      }
      this.appointment.date = new Date(res.date);
      this.appointment.note = res.note;
    });

    this.loadParticipants();
    this.appointment.participant = this.exampleData[0];
    this.options = {
      multiple: false,
      closeOnSelect: false
    }
  }


  loadParticipants() {
    if (this.data.participantDetails) {
      this.exampleData = [this.data.participantDetails];
      this.exampleData = this.exampleData.map(res => {
        return ({
          text: this.data.participantDetails.firstName + " " + this.data.participantDetails.lastName,
          id: this.data.participantDetails.id,
          firstName: this.data.participantDetails.firstName,
          lastName: this.data.participantDetails.lastName
        })
      });
    }
    else {
      let queryParams = new QueryParamsModel(
        this.filterConfiguration(),
      );
      this.store.dispatch(new ParticipantsPageRequested({ page: queryParams }));
      this.store.pipe(select(selectParticipantsInStore)).subscribe(res => {
        if (res.total == 0) {
          return;
        }
        this.participantList = res;
        if (this.participantList && this.participantList.items) {
          this.exampleData = this.participantList.items.map(participant => {
            return {
              id: participant.id,
              text: participant.firstName + " " + participant.lastName,
              firstName: participant.firstName,
              lastName: participant.lastName
            };
          })
        }

      })
    }
  }

  filterConfiguration(): any {
    const filter: any = {};
    return filter;
  }

  public changed(value: any): void {
    this.appointment.participant =
    {
      fullName: value.data[0].text,
      id: value.data[0].id,
      firstName: value.data[0].firstName,
      lastName: value.data[0].lastName,
    }
  }

 // submit(_appointment: Appointment) {
  submit() {
    this.hasFormErrors = false;
    /** check form */
    if (!this.isFormValid()) {
      this.hasFormErrors = true;
      return;
    }
    const newAppointment = new Appointment();
    newAppointment.clear();

    const preparedAppointment = this.prepareAppointment();
    const formattedStartTime = moment(this.appointment.starttimeObj, 'hh:mm A').format('HH:mm');
    this.currentTime = moment();
    const prevDate = moment(this.appointment.date).format('YYYY-MM-DD') + " ";
    const startTime = formattedStartTime;
    const endTime = this.endtime;
    this.startDateTime = moment(prevDate + startTime);
    this.endDateTime = moment(prevDate + endTime);
    if (this.startDateTime.isBefore(this.currentTime)) {
      this.selecTimeErr = true;
      this.selecTimeErrText = "The time is of the past";
      return;
    } else {
      this.selecTimeErr = false;
    }
    if (this.endDateTime.isBefore(this.startDateTime)) {
      this.selecTimeErr = true;
      this.selecTimeErrText = "End time should be greater than start time";
      return;
    } else {
      this.selecTimeErr = false;
    }
    if (preparedAppointment.id) {
      this.updateAppointment(preparedAppointment);
    } else {
      this.addAppointment(preparedAppointment);
    }

  }


  prepareAppointment(): Appointment {
    const _appointment = new Appointment();
    _appointment.clear();
    _appointment.id = this.appointment.id;
    _appointment.practitioner = this.appointment.practitioner;
    _appointment.type = this.appointment.type;
    _appointment.participant = this.appointment.participant;
    _appointment.date = this.appointment.date;
    _appointment.starttime = moment(this.appointment.starttimeObj, 'hh:mm A').format('HH:mm');
    _appointment.endtime = moment(this.endtime, 'hh:mm A').format('HH:mm');
    _appointment.note = this.appointment.note;
    _appointment.appointmentStatus = "confirmed";
    return _appointment;
  }

  addAppointment(_appointment: Appointment) {
    this.store.dispatch(new AppointmentOnServerCreated({ appointment: _appointment }));
    const addSubscription = this.store.pipe(select(selectLastCreatedAppointmentId)).subscribe(newId => {
      if (!newId) {
        return;
      }
      const preparedNotification = this.prepareNotification("booked");
      this.store.dispatch(new NotificationOnServerCreated({ notification: preparedNotification }));
      this.dialogRef.close({
        _appointment,
        isCreatedFromEvent: true
      });
    });
    this.subscriptions.push(addSubscription);
  }

  updateAppointment(_appointment: Appointment) {
    const updateAppointment: Update<Appointment> = {
      id: this.appointment.id,
      changes: _appointment
    };
    const preparedNotification = this.prepareNotification("rescheduled");
    this.store.dispatch(new NotificationOnServerCreated({ notification: preparedNotification }));
    this.store.dispatch(new AppointmentUpdated({
      partialappointment: updateAppointment,
      appointment: _appointment
    }));
    this.dialogRef.close({
      _appointment,
      isEdit: true
    });
  }

  /**
     * Returns is title valid
     */
  isFormValid(): boolean {
    return (this.appointment && this.appointment.type && this.appointment.type.length > 0 && (this.appointment.practitioner && this.appointment.practitioner.length > 0) && (this.appointment.starttimeObj && Object.keys(this.appointment.starttimeObj).length > 0) && (this.endtime && Object.keys(this.endtime).length > 0));
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.map(item => item && item.unsubscribe());
    }
  }

  onChangeTime(time) {
    this.endtime = moment(time, 'hh:mm A').format('HH:mm');
    this.endtimeHour = parseInt(this.endtime.split(":")[0]);
    this.endtimeMinute = parseInt(this.endtime.split(":")[1]);
    this.endtimeMinute = this.endtimeMinute + 30;
    if (this.endtimeMinute >= 60) {
      this.endtimeHour = this.endtimeHour + 1;
      this.endtimeMinute = this.endtimeMinute - 60;
    }
    this.endtime = this.endtimeHour + ":" + this.endtimeMinute;
    this.endtime = moment(this.endtime, 'HH:mm').format('hh:mm A');
  }

  prepareNotification(notificationType) {
    const practitioner = this.appointment.practitioner;
    const _notification = new Notification();
    _notification.clear();
    _notification.id = undefined;
    _notification.notify = "participant";
    _notification.message = practitioner + " has " + notificationType + " an appointment";
    _notification.read = false;
    _notification.time = new Date();
    _notification.redirectLink = "participant-appointments/view";
    _notification.appointmentDate = new Date(this.appointment.date);
    _notification.type = "appointment";
    return _notification;
  }

}
