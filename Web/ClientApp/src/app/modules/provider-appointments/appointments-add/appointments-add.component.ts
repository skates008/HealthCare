import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Appointment, AppointmentOnServerCreated, selectLastCreatedAppointmentId, selectParticipantsInStore, ParticipantsPageRequested, selectAppointmentById, AppointmentUpdated, Notification, NotificationOnServerCreated, PractitionerPageRequested, selectPractitionerInStore, TeamsPageRequested, selectTeamsInStore, currentUser } from './../../../core/auth';
import { AuthService, ParticipantService, AppointmentService, PractitionerService } from './../../../core/_services';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { LayoutUtilsService, MessageType, QueryParamsModel } from './../../../core/_base/crud';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Select2OptionData } from 'ng2-select2';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material';
import { Update } from '@ngrx/entity';
import { FormControl } from '@angular/forms';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { startWith, map } from 'rxjs/operators';
import { RRule, RRuleSet, rrulestr } from 'rrule'
import { RecurringAppointmentsDialogComponent } from './recurring-appointments-dialog/recurring-appointments-dialog.component';

@Component({
  selector: 'kt-appointments-add',
  templateUrl: './appointments-add.component.html',
  styleUrls: ['./appointments-add.component.scss']
})
export class ProviderAppointmentsAddComponent implements OnInit {

  @ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;

  appointment: Appointment;
  hasFormErrors: boolean = false;
  private subscriptions: Subscription[] = [];
  appointment$: Observable<Appointment>;
  public exampleData: Array<Select2OptionData>;
  // public options: Select2Options;
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
  headerTitle: string = 'New Appointment';
  endtime: any;
  endtimeHour: any;
  endtimeMinute: any;
  calendarView: any;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  practitionerList: any;
  practitionerData: any;
  addressResult: any;
  selectedAddress: string;
  selectedParticipant: any;
  showAddress: boolean = false;
  inputDisabled: boolean = false;
  hasSchoolAddress: boolean = false;
  addressOptions: string[];
  teamList: any;
  teamOptions: any;
  selectedTeam = new FormControl();
  filteredTeamOptions: Observable<string[]>;
  selectedTeamID: string;
  listAppointmentType: any;
  participantName: string;
  showParticipant: boolean = true;
  addressList: any;
  loggedInUser: any;
  showRecurrenceFields: boolean = false;
  recurrenceDay: any;
  // showReapeat: boolean = true;
  recurrenceType: any;
  freq: any;
  showDate: boolean = true;
  showOccurences: boolean = false;
  showWeekRepeat: boolean = true;
  showMonthRepeat: boolean = false;
  interval: number = 1;
  count: number;
  until: any;
  endType: string = "onDate";
  byDay: any;
  monthDay: any;
  repeatMonthType: string = "byMonthDay";
  repeatYearType: string = "yealyByMonth";
  rule: any;
  setPos: any = 1;
  daysOfMonth: any = RRule.SU;
  loggedInUserRole: string;
  // yearly
  monthOfYear: any = 1;
  monthDayOfYear: any = 1;
  yearlySetPos: any = 1
  yearlyDays: any = RRule.SU;
  yearlyMonthSetPos: any = 1;
  rrule: any;
  daysOfWeek: any = [RRule.SU];


  options =
    {
      types: [],
      componentRestrictions: { country: 'AU' }
    };

  recurrence = [
    { value: 'doesnotOccur', viewValue: 'Does not Occur' },
    { value: 'custom', viewValue: 'Custom' }
  ];

  frequency = [
    { value: RRule.DAILY, viewValue: 'Day' },
    { value: RRule.WEEKLY, viewValue: 'Week' },
    { value: RRule.MONTHLY, viewValue: 'Month' },
    { value: RRule.YEARLY, viewValue: 'Year' }
  ];

  listDaysOfWeek = [
    { value: RRule.SU, viewValue: 'SUN' },
    { value: RRule.MO, viewValue: 'MON' },
    { value: RRule.TU, viewValue: 'TUE' },
    { value: RRule.WE, viewValue: 'WED' },
    { value: RRule.TH, viewValue: 'THU' },
    { value: RRule.FR, viewValue: 'FRI' },
    { value: RRule.SA, viewValue: 'SAT' },
  ];
  listOfSetPos = [
    { value: 1, viewValue: 'First' },
    { value: 2, viewValue: 'Second' },
    { value: 3, viewValue: 'Third' },
    { value: 4, viewValue: 'Fourth' },
    { value: -1, viewValue: 'Last' },
  ]

  listDaysOfMonth = [
    { value: RRule.SU, viewValue: 'Sunday' },
    { value: RRule.MO, viewValue: 'Monday' },
    { value: RRule.TU, viewValue: 'Tuesday' },
    { value: RRule.WE, viewValue: 'Wednesday' },
    { value: RRule.TH, viewValue: 'Thursday' },
    { value: RRule.FR, viewValue: 'Friday' },
    { value: RRule.SA, viewValue: 'Saturday' },
    { value: [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA], viewValue: 'Day' },
    { value: [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR], viewValue: 'Weekday' },
    { value: RRule.SU, viewValue: 'Weekend day' },
  ];

  listMonthOfYear = [
    { value: 1, viewValue: 'Jan' },
    { value: 2, viewValue: 'Feb' },
    { value: 3, viewValue: 'Mar' },
    { value: 4, viewValue: 'Apr' },
    { value: 5, viewValue: 'May' },
    { value: 6, viewValue: 'Jun' },
    { value: 7, viewValue: 'Jul' },
    { value: 8, viewValue: 'Aug' },
    { value: 9, viewValue: 'Sep' },
    { value: 10, viewValue: 'Oct' },
    { value: 11, viewValue: 'Nov' },
    { value: 12, viewValue: 'Dec' }
  ]




  constructor(private store: Store<AppState>,
    private layoutUtilsService: LayoutUtilsService,
    private _dialog: MatDialog,
    public dialogRef: MatDialogRef<ProviderAppointmentsAddComponent>,
    private auth: AuthService,
    private participant: ParticipantService,
    private appointmentService: AppointmentService,
    private practitioner: PractitionerService,
    dateTimeAdapter: DateTimeAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    dateTimeAdapter.setLocale('en-AU');
    this.store.pipe(select(currentUser)).subscribe((response) => {
      this.loggedInUser = response;
      // this.loggedInUserRole = this.loggedInUser.role
    })
  }

  ngOnInit() {
    this.appointment = new Appointment;
    this.buttonText = 'Create Appointment';
    this.appointment.starttimeObj = this.data.date;
    var outputTime = moment(this.appointment.starttimeObj, 'MMMM Do YYYY, h:mm:ss a').add(30, 'minutes').format();
    this.endtime = moment(outputTime).format();
    //update appointment
    if (this.data.appointment && this.data.reschedule) {
      // this.appointment = this.data.appointment;
      this.buttonText = 'Update Appointment';
      this.headerTitle = 'Edit Appointment';
      this.appointment.id = this.data.appointment.id;
      this.appointment.starttimeObj = new Date(this.data.appointment.startTime);
      this.endtime = new Date(this.data.appointment.endTime);
      this.appointment.addressType = this.data.appointment.address.addressType;
      this.appointment.appointmentType = this.data.appointment.appointmentTypeId;
      this.showAddress = true;
      this.appointment.location = this.data.appointment.address.address;
      this.data.participant = this.data.appointment.patientId;
      this.appointment.address = this.data.appointment.address;
      this.appointment.note = this.data.appointment.note;
      this.appointment.practitionerId = this.data.appointment.practitionerId;


      //  Recurring Edit
      if (this.data.appointment.isRecurring) {
        var options = RRule.parseString(this.data.appointment.recurrence.rRule);
        var parsedRule = new RRule(options).origOptions;
        this.recurrenceType = "custom";
        this.showRecurrenceFields = true;
        if (parsedRule.count) {
          this.endType = "after";
        } else {
          this.endType = "onDate";
        }
        if (parsedRule.freq == 2 || parsedRule.freq == 3) {
          this.freq = parsedRule.freq;
          this.interval = parsedRule.interval;
          this.count = parsedRule.count;
          this.until = parsedRule.until;
          this.daysOfWeek = parsedRule.byweekday;

        }

        if (parsedRule.freq == 1 && parsedRule.bymonthday) {
          this.repeatMonthType = "byMonthDay";
          this.freq = parsedRule.freq;
          this.interval = parsedRule.interval;
          this.count = parsedRule.count;
          this.until = parsedRule.until;
          this.monthDay = parsedRule.bymonthday;
          this.daysOfMonth = parsedRule.byweekday[0];
          this.setPos = parsedRule.bysetpos;
        } else {
          if (parsedRule.freq == 1 && parsedRule.bysetpos) {
            this.repeatMonthType = "bySetPos";
            this.freq = parsedRule.freq;
            this.interval = parsedRule.interval;
            this.count = parsedRule.count;
            this.until = parsedRule.until;
            this.monthDay = parsedRule.bymonthday;
            this.daysOfMonth = parsedRule.byweekday[0];
            this.setPos = parsedRule.bysetpos;
          }
        }
        if (parsedRule.freq == 0 && parsedRule.bymonthday) {
          // this.repeatMonthType = "byMonthDay";
          this.repeatYearType = "yealyByMonth";
          this.freq = parsedRule.freq;
          this.interval = parsedRule.interval;
          this.count = parsedRule.count;
          this.until = parsedRule.until;
          this.monthDayOfYear = parsedRule.bymonthday;
          this.monthOfYear = parsedRule.bymonth;
        } else {
          if (parsedRule.freq == 0 && parsedRule.bysetpos) {
            // this.repeatMonthType = "bySetPos";
            this.repeatYearType = "yearlyBySetPos";
            this.freq = parsedRule.freq;
            this.interval = parsedRule.interval;
            this.count = parsedRule.count;
            this.until = parsedRule.until;
            this.yearlyDays = parsedRule.byweekday[0];
            this.yearlySetPos = parsedRule.bysetpos;
            this.yearlyMonthSetPos = parsedRule.bymonth;
          }
        }
      }
    }
    else {
      this.recurrenceType = "doesnotOccur";
    }
    //navigated from profile
    if (this.data.participantDetails) {
      this.participantName = this.data.participantDetails.firstName + ' ' + this.data.participantDetails.lastName;
      // this.appointment.location = this.data.participantDetails.address;
      this.appointment.participant = this.data.participantDetails.id;
      this.headerTitle = 'New Appointment for ' + this.participantName;
      this.showParticipant = false;
      this.loadAddressList(this.data.participantDetails.id);
    }

    this.loadParticipants();
    this.loadTeams();
    this.loadAppointmentType();
    if (this.data.practitioner) {
      this.practitionerList = this.data.practitioner;
      this.appointment.practitioner = this.practitionerList[0].id;
    } else {
      this.loadPractitioner();
    }
  }


  loadParticipants() {
    this.participant.listParticipant().subscribe(res => {
      this.participantList = res;
      // reshcedule appointment
      if (this.data.appointment && this.data.reschedule) {
        this.participantList = this.participantList.filter(res => {
          return res.id != this.data.appointment.patientId;
        })
        let appointedParticipant = { id: this.data.appointment.patientId, text: this.data.appointment.patientName }
        this.participantList.splice(0, 0, appointedParticipant);
      }

    })
  }

  filterConfiguration(): any {
    const filter: any = {};
    return filter;
  }

  public changed(value: any): void {
    this.appointment.participant = value.data[0].id;
    this.selectedParticipant = value.data[0];
    this.loadAddressList(this.selectedParticipant.id);
  }

  therapistChanged(value) {
    this.appointment.practitioner = value.data[0].id;
  }

  loadAppointmentType(){
    this.appointmentService.listAppointmentType().subscribe(res => {
      this.listAppointmentType = res;
    })
  }



  submit() {
    this.hasFormErrors = false;
    const newAppointment = new Appointment();
    newAppointment.clear();
    // generate rule 
    if (this.recurrenceType == "custom") {

      if (this.freq == RRule.DAILY || this.freq == RRule.WEEKLY) {
        this.rule = new RRule({
          freq: this.freq,
          interval: this.interval,
          byweekday: this.byDay,
          until: this.until,
          count: this.count,
        })
      }

      if (this.freq == RRule.MONTHLY && this.repeatMonthType == "byMonthDay") {
        this.rule = new RRule({
          freq: this.freq,
          interval: this.interval,
          bymonthday: this.monthDay,
          until: this.until,
          count: this.count
        })
      }
      else if (this.freq == RRule.MONTHLY && this.repeatMonthType == "bySetPos") {
        this.rule = new RRule({
          freq: this.freq,
          interval: this.interval,
          byweekday: this.daysOfMonth,
          bysetpos: this.setPos,
          until: this.until,
          count: this.count

        })
      }

      if (this.freq == RRule.YEARLY && this.repeatYearType == "yealyByMonth") {
        this.rule = new RRule({
          freq: this.freq,
          bymonth: this.monthOfYear,
          bymonthday: this.monthDayOfYear,
          until: this.until,
          count: this.count
        })
      }
      else if (this.freq == RRule.YEARLY && this.repeatYearType == "yearlyBySetPos") {
        this.rule = new RRule({
          freq: this.freq,
          byweekday: this.yearlyDays,
          bysetpos: this.yearlySetPos,
          bymonth: this.yearlyMonthSetPos,
          until: this.until,
          count: this.count
        })
      }

      this.rrule = this.rule.toString();
    }

    const preparedAppointment = this.prepareAppointment();
    const formattedStartTime = moment(this.appointment.starttimeObj).format('HH:mm');
    const formattedEndTime = moment(this.endtime).format('HH:mm');
    this.currentTime = moment();
    const prevDate = moment(this.appointment.starttimeObj).format('YYYY-MM-DD') + ' ';
    const startTime = formattedStartTime;
    const endTime = formattedEndTime;
    this.startDateTime = moment(prevDate + startTime);
    this.endDateTime = moment(prevDate + endTime);
    if (this.startDateTime.isBefore(this.currentTime)) {
      this.selecTimeErr = true;
      this.selecTimeErrText = 'The time is of the past';
      return;
    } else {
      this.selecTimeErr = false;
    }
    if (this.endDateTime.isBefore(this.startDateTime)) {
      this.selecTimeErr = true;
      this.selecTimeErrText = 'End time should be greater than start time';
      return;
    } else {
      this.selecTimeErr = false;
    }
    if (preparedAppointment.id && !this.data.appointment.isRecurring) {
      this.updateAppointment(preparedAppointment);
    } else if (preparedAppointment.id && this.data.appointment && this.data.appointment.isRecurring) {
      const dialogRecurringEvnet = this._dialog.open(RecurringAppointmentsDialogComponent, {
        width: "650px",
        data: { updateAppointmentDetail: preparedAppointment }
      });
      this.dialogRef.close();
    }
    else {
      this.addAppointment(preparedAppointment);
    }
  }


  prepareAppointment(): Appointment {
    const _appointment = new Appointment();
    _appointment.clear();
    _appointment.id = this.appointment.id;
    // if (this.loggedInUser.role == "User") {
    //   _appointment.practitionerId = this.loggedInUser.userId;
    // } else {
      _appointment.practitionerId = this.appointment.practitioner;
    // }
    if (this.recurrenceType == "custom" && !this.data.appointment && !this.data.reschedule) {
      _appointment.recurrence = {
        rrule: this.rrule.split(':')[1]
      }
    } else if (this.data.appointment && this.data.appointment.isRecurring) {
      _appointment.recurrence = {
        groupId: this.data.appointment.recurrence.groupId,
        isException: this.data.appointment.isException,
        rrule: this.rrule.split(':')[1]
      }
    }
    _appointment.AppointmentTypeId = this.appointment.appointmentType;
    _appointment.address = this.appointment.address;
    _appointment.location = this.appointment.location;
    _appointment.patientId = this.appointment.participant;
    // _appointment.addressType = this.appointment.addressType;
    _appointment.startTime = moment(this.appointment.starttimeObj).format('YYYY-MM-DDTHH:mm:ss.SSS');
    _appointment.endTime = moment(this.endtime).format('YYYY-MM-DDTHH:mm:ss.SSS');;
    _appointment.appointmentDate = moment(this.appointment.starttimeObj).format('YYYY-MM-DDTHH:mm:ss.SSS');
    _appointment.note = this.appointment.note;
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
    this.appointmentService.updateAppointment(_appointment).subscribe(res => {
      if (res.success) {
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
    var outputTime = moment(time.value).add(30, 'minutes').format();
    this.endtime = outputTime;
  }

  prepareNotification(notificationType) {
    const practitioner = this.appointment.practitioner;
    const _notification = new Notification();
    _notification.clear();
    _notification.id = undefined;
    _notification.notify = 'participant';
    _notification.message = practitioner + ' has ' + notificationType + ' an appointment';
    _notification.read = false;
    _notification.time = new Date();
    _notification.redirectLink = 'participant-appointments/view';
    _notification.appointmentDate = new Date(this.appointment.date);
    _notification.type = 'appointment';
    return _notification;
  }

  loadPractitioner() {
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
      if (this.data.appointment && this.data.reschedule) {
        this.practitionerList = this.practitionerList && this.practitionerList.filter(res => {
          return res.id != this.data.appointment.practitionerId;
        })
        let appointedPractitioner = { id: this.data.appointment.practitionerId, text: this.data.appointment.practitionerName }
        this.practitionerList && this.practitionerList.splice(0, 0, appointedPractitioner);
      }
    })
  }

  loadPractitionerWithTeam(teamId) {
    this.practitioner.findPractitionerWithTeam(teamId).subscribe(res => {
      // if (res.length == 0) {
      //   return;
      // }
      this.practitionerList = res;
      if (this.practitionerList.length > 0) {
        this.appointment.practitioner = this.practitionerList[0].id;
      }
    })

  }

  handleAddressChange(address) {
    let streetNumber = "";
    let streetName = "";
    let city = "";
    let state = "";
    let postCode = "";
    let country = "";
    address.address_components.forEach(res => {
      res.types.includes("street_number") ? streetNumber = res.long_name : "";
      res.types.includes("route") ? streetName = res.long_name : "";
      res.types.includes("administrative_area_level_2") ? city = res.long_name : "";
      res.types.includes("administrative_area_level_1") ? state = res.long_name : "";
      res.types.includes("postal_code") ? postCode = res.long_name : "";
      res.types.includes("country") ? country = res.long_name : "";

    })


    this.appointment.address = {
      address: address.formatted_address, //prev location
      streetName: streetName,
      streetNumber: streetNumber,
      unit: null,
      city: city,
      state: state,
      postalCode: postCode,
      country: country,
      latitude: address.geometry.location.lat(),
      longitude: address.geometry.location.lng(),
      observations: null,
      addressType: "Other"
    }
  }

  selectAddress(addressType) {
    let selectedAddress = this.addressOptions.find(res => res['address'].addressType == addressType)
    this.showAddress = true;
    if (selectedAddress['text'] != "Other") {
      this.inputDisabled = true;
      this.appointment.location = selectedAddress['address'].address;
      this.appointment.address = selectedAddress['address'];
    } else {
      this.inputDisabled = false;
      this.appointment.location = "";
      this.appointment.address = "";
    }
  }

  closeDialogBox() {
    this.dialogRef.close();
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
    this.loadPractitionerWithTeam(this.selectedTeamID)
  }

  teamInputClick() {
    this.selectedTeam.setValue("");
    this.selectedTeamID = "";
    this.loadPractitioner();
  }

  loadAddressList(id) {
    this.participant.getPatientAddressList(id).subscribe(res => {
      this.addressOptions = res;
      if (this.data.appointment && this.data.reschedule) {
        this.appointment.addressType = this.data.appointment.address.addressType;
      }
    })
  }

  selectRecurrenceType(recurrenceType) {
    if (recurrenceType == "custom") {
      this.freq = 2;
      this.showRecurrenceFields = true;
    } else {
      this.showRecurrenceFields = false;
    }
  }

  selectRecurrenceFrequency(frequency) {
    this.freq = frequency;
    this.byDay = null;
    if (this.freq == 2) {  
    } else if (this.freq == 1) { 
      this.monthDay = 1;
    } else if (this.freq == 3) {
      // this.showMonthRepeat = false;
      // this.showWeekRepeat = false;  
      // this.generateReccurenceRule();
    }
    // this.generateReccurenceRule();
  }

  selectRecurenceEnd(event) {
    if (event == "onDate") {
      this.count = null;
      this.endType = "onDate";
    } else if (event == "after") {
      this.endType = "after";
      this.until = null;
      this.count = 1;
    } else {
      // this.showOccurences = false;
      // this.showDate = false;
    }
    // this.generateReccurenceRule();
  }



  seletDaysOfWeek(group) {
    this.byDay = group.value;
    // this.();
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  selectRepeatMonthType(value) {
    this.repeatMonthType = value;
    if (this.repeatMonthType == "byMonthDay") {
    } else if (this.repeatMonthType == "bySetPos") {
    }
  }

  selectYearRepeatType(value) {
    this.repeatYearType = value;
  }

}

