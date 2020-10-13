import { Component, OnInit, Inject } from '@angular/core';
import { Appointment, BillableItemsForTimeRequested, selectBillableItemsInStore, Time } from './../../../core/auth';
import moment from 'moment';
import { AuthService, AppointmentService, CareplanService, NoteService } from './../../../core/_services';
import { LayoutUtilsService } from './../../../core/_base/crud';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProviderEventsComponent } from '../events/events.component';
import { AppState } from './../../../core/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { ProviderAppointmentsAddComponent } from '../appointments-add/appointments-add.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LocaleService } from 'ngx-daterangepicker-material';
import { ToastrService } from 'ngx-toastr';
import { AppointmentDetailsComponent } from '../appointment-details/appointment-details.component';
import { EventsDialogComponent } from '../events-dialog/events-dialog.component';
import { RecurringAppointmentsDialogComponent } from '../appointments-add/recurring-appointments-dialog/recurring-appointments-dialog.component';


@Component({
  selector: 'kt-events-dialog-checkin',
  templateUrl: './events-dialog-checkin.component.html',
  styleUrls: ['./events-dialog-checkin.component.scss']
})
export class EventsDialogCheckinComponent implements OnInit {

  eventDetails: any;
  timeDuration: any;
  hours: any;
  viewLoading = false;
  loadingAfterSubmit = false;
  duration: any;
  appointmentInterval: any;
  formattedStarttime: any;
  minutes: any
  appointment: Appointment;
  careplanDropdown: any;
  checkoutForm: FormGroup;
  newCheckoutFormGroup: FormGroup;
  billableItemDropDown: any;
  hasDefaultplaceholder: boolean = true;
  currentUnit: any;
  appointmenttStatus: string;
  checkInTime: any;
  checkOutTime: any;
  showCancelAppointmentSection: boolean = false;
  cancelReasons: string[] = ['Feeling Better', 'Condition Worse', 'Sick', 'Away', 'Work', 'Other'];
  cancelReason: string = "";
  cancelNotes: string = "";
  userLocationLatitude: any;
  userLocationLongitude: any;
  showInternalNote: boolean = false;
  loading: boolean = false;
  locationSrc: any;
  internalNote: string;
  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ProviderEventsComponent>,
    private store: Store<AppState>,
    private checkoutFB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private appointmentService: AppointmentService,
    private careplanService: CareplanService,
    private noteService: NoteService,
    private toastr: ToastrService,
  ) {

    this.checkoutForm = this.checkoutFB.group({
      externalNote: ['', Validators.required],
      careplanId: ['', Validators.required],
      billableItems: this.checkoutFB.array([
        this.newCheckoutFormGroup = this.checkoutFB.group({
          id: ['', Validators.required],
          startTime: ['', Validators.required],
          quantity: ['', Validators.required],
          placeholder: ['Quantity']
        })
      ])
    })

  }


  ngOnInit() {
    // this.eventDetails = this.data.eventDetails;
    this.getAppointmentById(this.data.eventDetails.id);
    this.loadCareplanList(this.data.eventDetails.patientId);
    this.loadBillableItems();
  }

  createForm() {
    this.checkoutForm = this.checkoutFB.group({
      // internalNote: ['', Validators.required],
      externalNote: ['', Validators.required],
      careplanId: ['', Validators.required],
      billableItems: this.checkoutFB.array([
        this.newCheckoutFormGroup = this.checkoutFB.group({
          startTime: ['', Validators.required],
          id: ['', Validators.required],
          quantity: ['', Validators.required],
        })
      ])
    })
  }

  getAppointmentById(id) {
    this.appointmentService.getAppointmentById(id).subscribe(res => {
      if (res) {
        this.eventDetails = res.data;

        if(this.eventDetails && this.eventDetails.address &&  this.eventDetails.address.latitude){
          this.locationSrc = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDIwpPULzDj2lIZflF0uUGlxCckz4vxJ_s&q="+this.eventDetails.address.latitude+","+this.eventDetails.address.longitude+"&zoom=14";
          }else{
            this.locationSrc = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDIwpPULzDj2lIZflF0uUGlxCckz4vxJ_s&q=-31.953512,115.857048&zoom=14";
          }
        this.checkInTime = moment(res.data.checkInTime).format("hh:mm A");
        this.checkOutTime = moment(res.data.checkOutTime).format("hh:mm A");
        this.formattedStarttime = moment(this.eventDetails.startTime).format("hh:mm A");
        const startTime = moment(this.eventDetails.startTime).format("DD/MM/YYYY HH:mm:ss");
        const endTime = moment(this.eventDetails.endTime).format("DD/MM/YYYY HH:mm:ss");
        const diff = moment(endTime, "DD/MM/YYYY HH:mm:ss").diff(moment(startTime, "DD/MM/YYYY HH:mm:ss"));
        this.duration = moment.duration(diff);
        this.hours = parseInt(this.duration.asHours());
        this.appointmenttStatus = this.eventDetails.appointmentStatus;
        if (this.hours > 0) {
          this.minutes = parseInt(this.duration.asMinutes()) - this.hours * 60;
        } else {
          this.minutes = parseInt(this.duration.asMinutes());
        }
        this.appointmentInterval = (this.hours > 0 && this.minutes > 0) ? (this.hours + ' hour and ' + this.minutes + ' minutes.') : (this.hours > 0 && this.minutes == 0) ? this.hours + ' hour' : this.minutes + ' minutes';
      }
    })
  }
  editAppointment(appointment) {
    const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, { data: { appointment: appointment, reschedule: true } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close({
        isEdit: true
      });
    });
  }


  loadCareplanList(id) {
    this.careplanService.findCareplansForTimeEntry(id).subscribe(res => {
      // this.careplanDropdown = res;
      this.careplanDropdown = res;
      // if(this.careplanDropdown.length == 0){
      // 	this.hasNoCareplan = true;
      // }
    })
  }

  loadBillableItems() {
    this.store.dispatch(new BillableItemsForTimeRequested());
    this.store.pipe(select(selectBillableItemsInStore)).subscribe(res => {
      this.billableItemDropDown = res.data;
    });
  }

  billableSelected(index, value) {
    this.hasDefaultplaceholder = false;
    var data = this.billableItemDropDown.filter(function (unit) {
      return unit.id == value;
    });

    this.currentUnit = data[0].unit;
    let _arr = this.checkoutForm.controls.billableItems as FormArray;
    let _group = _arr.at(index) as FormGroup;
    _group.controls.placeholder = this.currentUnit;
  }

  // add time Name
  addTimeItem() {
    let timeFormArray = this.checkoutForm.controls.billableItems as FormArray;
    let arraylen = timeFormArray.length;

    var newTimeFormGroup: FormGroup = this.checkoutFB.group({
      startTime: [''],
      id: [''],
      quantity: [''],
      placeholder: ['Quantity']
    });

    timeFormArray.insert(arraylen, newTimeFormGroup);
  }

  closeDialogBox() {
    this.dialogRef.close({
      isEdit: true
    });
  }

  apptAction(event, apptStatus) {
    const data = {
      id: event.id,
      action: apptStatus
    }
    this.appointmentService.apptAction(event.id, data).subscribe(res => {
      if (res.success) {
        this.getAppointmentById(event.id);
        this.checkInTime = moment(res.data.checkInTime).format("hh:mm A");
        this.checkOutTime = moment(res.data.checkOutTime).format("hh:mm A");
      }
    }
    )
  }


  prepareCheckout() {
    const controls = this.checkoutForm.controls;
    const checkout = new Appointment();
    // checkout.internalNote = controls['internalNote'].value;
    checkout.externalNote = controls['externalNote'].value;
    checkout.patientId = this.data.eventDetails.patientId;
    checkout.action = "Finalize",
      checkout.timeEntry = {
        careplanId: controls['careplanId'].value,
        appointmentId: this.eventDetails.id,
        name: this.eventDetails.appointmentTypeName,
        BillableItems: controls['billableItems'].value,
      }
    checkout.id = this.eventDetails.id;
    return checkout;
  }

  onSubmit() {
    const data = this.prepareCheckout();
    const _title: string = 'Internal Notes';
    const _description: string = 'Do you want to add Internal Notes?';
    const _waitDesciption: string = 'Loading Internal Notes';

    this.appointmentService.apptAction(this.eventDetails.id, data).subscribe(res => {
      if (res.success) {
        this.getAppointmentById(this.eventDetails.id);
        this.toastr.success("Appointment completed successfully", 'Success', {
          timeOut: 3000
        });
       let dialogId = this.dialog.openDialogs[0].id;
        document.getElementById(dialogId).style.display = "none";
        const dialogRefInternalNote = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRefInternalNote.afterClosed().subscribe(res => {
          if (res) {
            document.getElementById(dialogId).style.display = "block";
            this.showInternalNote = true;
          }
        });
      }
    })
  }

  // delete time Name
  deleteItems(i) {
    let timeFormArray = this.checkoutForm.controls.billableItems as FormArray;
    timeFormArray.removeAt(i);
  }


  cancelAppointment(appointment) {
    if(appointment.isRecurring){
      let cancelData = {
        Action: 4,
        cancelAppointmentReason: this.cancelReason,
        recurrence: appointment.recurrence
        //  cancelNotes: this.cancelNotes
      }
      const dialogRecurringEvnet = this.dialog.open(RecurringAppointmentsDialogComponent, {
        width: "650px",
        data: { cancelAppointment: true, cancelDetails:{ cancelData: cancelData, id : appointment.id} }
      });
    }else{
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
        //  cancelNotes: this.cancelNotes
      }
      this.appointmentService.cancelAppointment(id, cancelData).subscribe(res => {
        if (res.success) {
          this.toastr.success("Appointment cancelled successfully", 'Success', {
            timeOut: 3000
          });
          this.dialogRef.close({
            isEdit: true
          });
        }
      })
    });
  
  }
}

  showCancelAppointment() {
    this.showCancelAppointmentSection = true;
  }

  hideCancelApptDialog() {
    this.showCancelAppointmentSection = false;
  }

  radioChange(e) {
    this.cancelReason = e.value;
  }

  cancelFormValid(): boolean {
    return (this.cancelReason != "");
  }

  //  nextButton(){
  //    this.showExternalNote = true;
  //  }

  openNavigation() {
    this.loading = true;
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocationLatitude = position.coords.latitude;
          this.userLocationLongitude = position.coords.longitude;
          if (this.userLocationLatitude && this.userLocationLongitude) {
            this.loading = false;
            // window.open("https://www.google.com/maps/dir/?api=1&origin=" + this.userLocationLatitude + "," + this.userLocationLongitude + "&destination=-31.953512,115.857048", "_blank");
            window.open(`https://www.google.com/maps/dir/?api=1&origin=${this.userLocationLatitude},${this.userLocationLongitude}&destination=${this.eventDetails.address.latitude},${this.eventDetails.address.longitude}`);

          }
        })
    }

  }

  addInternalNotes() {
    let id = this.data.eventDetails.id;
    const controls = this.checkoutForm.controls;
    let careplanId = controls['careplanId'].value;
    let internalNotes = {
      Action: "InternalNote",
      InternalNote: this.internalNote,
      patientId: this.data.eventDetails.patientId,
      careplanId: controls['careplanId'].value,

    }
    this.noteService.addInternalNote(id, internalNotes).subscribe(res => {
      if (res.success) {
        this.dialogRef.close({
          isEdit: true
        });
        this.toastr.success("Internal Notes added successfully", 'Success', {
          timeOut: 3000
        });
      }

    })

  }


}
