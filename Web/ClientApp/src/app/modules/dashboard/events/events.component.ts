import { Component, OnInit, Inject } from '@angular/core';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { AppointmentDeleted, AppointmentArchived, Appointment } from './../../../core/auth';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { AppointmentsAddComponent } from '../appointments-add/appointments-add.component'

@Component({
  selector: 'kt-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  eventDetails: any;
  timeDuration: any;
  hours: any;
  duration: any;
  appointmentInterval: any;
  formattedStarttime: any;
  appointment: Appointment;
  showCancelApptDialog: boolean = false;
  cancelReasons: string[] = ['Feeling Better', 'Condition Worse', 'Sick', 'Away', 'Work', 'Other'];
  cancelReason: string;
  cancelNotes: string = "";
  archiveStatus: string;
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
    this.eventDetails = this.data.eventDetails;
    var startTime = moment(this.eventDetails.starttime, "HH:mm");

    const endTime = moment(this.eventDetails.endtime, "HH:mm");
    this.duration = moment.duration(endTime.diff(startTime));

    this.hours = parseInt(this.duration.asHours());
    var minutes = parseInt(this.duration.asMinutes()) - this.hours * 60;

    this.appointmentInterval = (minutes > 0) ? (this.hours + ' hour and ' + minutes + ' minutes.') : this.hours + ' hour';

    this.formattedStarttime = moment(this.eventDetails.starttime, ["hh:mm"]).format("h:mm a")
  }

  showCancelAppointment() {
    this.showCancelApptDialog = true;
  }
  
  archiveAppointment(appointment, status) {
    if (status == "cancel") {
      this.archiveStatus = "cancelled";
    } else {
      this.archiveStatus = "expired";

    }
    const _title: string = ' Appointment';
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


}