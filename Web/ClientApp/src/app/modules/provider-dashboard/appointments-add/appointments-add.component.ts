import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Appointment, AppointmentOnServerCreated, selectLastCreatedAppointmentId, selectParticipantsInStore, ParticipantsPageRequested, selectAppointmentById, AppointmentUpdated, Notification, NotificationOnServerCreated, PractitionerPageRequested, selectPractitionerInStore} from './../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { AuthService, ParticipantService, AppointmentService } from './../../../core/_services';
import { LayoutUtilsService, MessageType, QueryParamsModel } from './../../../core/_base/crud';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Select2OptionData } from 'ng2-select2';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material';
import { Update } from '@ngrx/entity';
import { FormControl } from '@angular/forms';
import { DateTimeAdapter } from 'ng-pick-datetime';

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
  calendarView: any;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  practitionerList: any;
  practitionerData:any;
  addressResult:any;
  selectedAddress: string;
  selectedParticipant: any;
  showAddress: boolean = false;
  inputDisabled: boolean =false;
  hasSchoolAddress: boolean = false;
  addressOptions: string[];

  constructor(private store: Store<AppState>,
    private layoutUtilsService: LayoutUtilsService,
    private _dialog: MatDialog,
    public dialogRef: MatDialogRef<AppointmentsAddComponent>,
    private auth : AuthService,
    private participantService: ParticipantService,
    private appointmentService: AppointmentService,
    dateTimeAdapter: DateTimeAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    dateTimeAdapter.setLocale('en-AU');
   }

  ngOnInit() {
    this.appointment = new Appointment;
    this.buttonText = "Create Appointment";
    this.appointment.starttimeObj = this.data.date;
    var outputTime =  moment(this.appointment.starttimeObj, 'MMMM Do YYYY, h:mm:ss a').add(30, 'minutes').format();
    this.endtime = moment(outputTime).format();

    if (this.data.appointment && this.data.reschedule) {
      // this.appointment = this.data.appointment;

      this.buttonText = "Update Appointment";
      this.headerTitle = "Edit Appointment";
      this.appointment.id = this.data.appointment.id;
      this.appointment.starttimeObj = new Date(this.data.appointment.startTime);
      this.endtime = new Date(this.data.appointment.endTime);
      this.appointment.addressType = this.data.appointment.addressType;
      this.showAddress = true;
      this.appointment.location = this.data.appointment.location;
      this.appointment.note = this.data.appointment.note;
    }
    this.loadParticipants();
    this.loadPractitioner();
    // if (this.data.participantDetails) {
    //   this.appointment.location = this.data.participantDetails.address;
    // }
  }


  loadParticipants() {
    this.participantService.listParticipant().subscribe(res=>{
      this.participantList = res;
      this.appointment.participant = this.participantList[0].id;
      if(this.participantList[0] && this.participantList[0].address && this.participantList[0].schoolAddress){
          this.addressOptions = ["Client Address", "School Address", "Other"];
      }else{
        this.addressOptions = ["Client Address", "Other"];
      }
      if(this.selectedAddress && this.selectedAddress == "Client Address"){
        this.appointment.location = this.selectedParticipant.address;
      }else if(this.selectedAddress && this.selectedAddress == "School Address"){
        this.appointment.location = this.selectedParticipant.schoolAddress;
      }

    })
  }

  filterConfiguration(): any {
    const filter: any = {};
    return filter;
  }

  public changed(value: any): void {
    this.appointment.participant = value.data[0].id;
    this.selectedParticipant =  value.data[0];
    if(this.selectedAddress && this.selectedAddress == "Client Address"){
      this.appointment.location = this.selectedParticipant.address;
    }else if( this.selectedAddress && this.selectedAddress == "School Address"){
      this.appointment.location = this.selectedParticipant.schoolAddress;
    }
    if(this.selectedParticipant && this.selectedParticipant.address && this.selectedParticipant.schoolAddress){
      this.addressOptions = ["Client Address", "School Address", "Other"];
    }else{
    this.addressOptions = ["Client Address", "Other"];
    }
  }

  therapistChanged(value){
    this.appointment.practitioner = value.data[0].id;
  }



  submit() {
    this.hasFormErrors = false;
    const newAppointment = new Appointment();
    newAppointment.clear();
    const preparedAppointment = this.prepareAppointment();
    const formattedStartTime = moment(this.appointment.starttimeObj).format('HH:mm');
    const formattedEndTime = moment(this.endtime).format('HH:mm');
    this.currentTime = moment();
    const prevDate = moment(this.appointment.starttimeObj).format('YYYY-MM-DD') + " ";
    const startTime = formattedStartTime;
    const endTime = formattedEndTime;
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
    _appointment.practitionerId = this.appointment.practitioner;
    _appointment.location = this.appointment.location;
    _appointment.patientId = this.appointment.participant;
    _appointment.addressType = this.selectedAddress;
    _appointment.startTime =  moment(this.appointment.starttimeObj).format('YYYY-MM-DDTHH:mm:ss.SSS');
    _appointment.endTime =  moment(this.endtime).format('YYYY-MM-DDTHH:mm:ss.SSS');;
    _appointment.appointmentDate = moment(this.appointment.starttimeObj).format('YYYY-MM-DDTHH:mm:ss.SSS');
    _appointment.note = this.appointment.note;
    _appointment.appointmentType = 1;
    return _appointment;
  }

  addAppointment(_appointment: Appointment) {
    this.store.dispatch(new AppointmentOnServerCreated({ appointment: _appointment }));
    const addSubscription = this.store.pipe(select(selectLastCreatedAppointmentId)).subscribe(newId => {
      if (!newId) {
        return;
      }
      this.dialogRef.close({
        _appointment,
    });
  })
}

  updateAppointment(_appointment: Appointment) {
    // const updateAppointment: Update<Appointment> = {
    //   id: this.appointment.id,
    //   changes: _appointment
    // };
    // this.store.dispatch(new AppointmentUpdated({
    //   partialappointment: updateAppointment,
    //   appointment: _appointment
    // }));
    this.appointmentService.updateAppointment(_appointment).subscribe(res=>{
      if(res.success){
        this.dialogRef.close({
          _appointment,
          isEdit: true
        });
      }
    })

  }

  /**
     * Returns is title valid
     */
  isFormValid(): boolean {
    return (this.appointment && this.appointment.type && this.appointment.type.length > 0 && (this.appointment.practitioner && this.appointment.practitioner.length > 0) && (this.appointment.starttimeObj && moment(this.appointment.starttimeObj).isValid() && (this.endtime && moment(this.endtime).isValid())));
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.map(item => item && item.unsubscribe());
    }
  }

  onChangeTime(time) {
   var outputTime =  moment(time.value).add(30, 'minutes').format();
  // this.endtime = moment(this.endtime, 'hh:mm A').format('');
   this.endtime = outputTime;
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

  loadPractitioner(){
    let queryParams = new QueryParamsModel(
      this.filterConfiguration(),
    );
    this.store.dispatch(new PractitionerPageRequested({ page: queryParams }));
    this.store.pipe(select(selectPractitionerInStore)).subscribe(res => {
      if (res.total == 0) {
        return;
      }
      this.practitionerList = res.data;
      this.appointment.practitioner = this.practitionerList[0].id;
  })
}


  handleAddressChange(address){
    this.appointment.location = address.formatted_address;
  }

  selectAddress(selectedAddress){
    this.selectedAddress = selectedAddress;
    this.showAddress = true;
    if(this.selectedAddress  == "Client Address"){
      this.appointment.location = this.selectedParticipant.address;
      this.inputDisabled= true;
    }else if(this.selectedAddress =="School Address"){
      this.inputDisabled= true;
      this.appointment.location = this.selectedParticipant.schoolAddress?  this.selectedParticipant.schoolAddress: "" ;
    }else{
      this.inputDisabled= false;
      this.appointment.location = "" ;
    }
  }

  closeDialogBox() {
    this.dialogRef.close();
  }


}
