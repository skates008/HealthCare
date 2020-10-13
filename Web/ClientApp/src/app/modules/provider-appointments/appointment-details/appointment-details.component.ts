import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeDeleted } from './../../../core/auth';
import { InvoiceService, TimeService, AppointmentService } from './../../../core/_services';
import { MatDialog } from '@angular/material';
import { TimeEntryAddComponent } from '../../timeEntry/timeEntry-add/timeEntry-add.component';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { MessageType, LayoutUtilsService } from './../../../core/_base/crud';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from './../../../core/reducers';

@Pipe({ name: 'safe' })

@Component({
  selector: 'kt-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: InvoiceService,
    private time: TimeService,
    private appointment: AppointmentService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private layoutUtilsService: LayoutUtilsService,
    private sanitizer: DomSanitizer,
    private cdr : ChangeDetectorRef
  ) {
  }

  appointmentDetails: any;
  timeEntries: any;
  duration: any;
  minutes: any
  hours: any;
  appointmentInterval: any;
  invoiceCreated: boolean = false;
  invoiceDetails: any;
  locationSrc: any;
  showNotes: any;
  visibilityIcon: string = "visibility";
  appointmentId: string;




  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.appointmentId = id;
      if (id) {
        this.getAppointmentDetailsById(id);
      }
    })
  }

  ngAfterViewInit(){
    this.cdr.detectChanges();
  }

  addTimeEntry(data){
    const dialogRefEvenet = this.dialog.open(TimeEntryAddComponent, {
      width: "600px",
      data: { appointmentDetails: data, "dialogOpenForTime": true }
    });
    dialogRefEvenet.afterClosed().subscribe(res => {
      if (res.dialogTimeEntry) {
        this.getAppointmentDetailsById(this.appointmentId);
      }

    });
  }

  createInvoice(apptDetails) {
    this.auth.createInvoiceFromAppointment(apptDetails.id).subscribe(res => {
      if (res) {
        this.invoiceCreated = true;
        this.invoiceDetails = res.data[0];
        this.toastr.success("Invoice successfully has been created", 'Success', {
          timeOut: 5000
        });
      }
    })
  }

  findDuration(appointmentDetails) {
    const startTime = moment(appointmentDetails.startTime).format("DD/MM/YYYY HH:mm:ss");
    const endTime = moment(appointmentDetails.endTime).format("DD/MM/YYYY HH:mm:ss");
    const diff = moment(endTime, "DD/MM/YYYY HH:mm:ss").diff(moment(startTime, "DD/MM/YYYY HH:mm:ss"));
    this.duration = moment.duration(diff);
    this.hours = parseInt(this.duration.asHours());
    if (this.hours > 0) {
      this.minutes = parseInt(this.duration.asMinutes()) - this.hours * 60;
    } else {
      this.minutes = parseInt(this.duration.asMinutes());
    }
    this.appointmentInterval = (this.hours > 0 && this.minutes > 0) ? (this.hours + ' hour and ' + this.minutes + ' minutes.') : (this.hours > 0 && this.minutes == 0) ? this.hours + ' hour' : this.minutes + ' minutes';
  }

  sendEmailToParticipant(id) {
    const _title: string = `Email Invoice to ${this.invoiceDetails.customerName}`;
    const _description: string = 'Are you sure you want to email this invoice ?';
    const _waitDescription: string = 'Please wait the invoice is being sent..';
    const _sendMessage: string = 'Invoice has been sent';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.auth.sendInvoice(id).subscribe(res => {
        if (res.success) {
          this.layoutUtilsService.showActionNotification(_sendMessage, MessageType.Update, 3000, true, true);
        } else {
          const msg = "Something went wrong ! Please try again"
          this.layoutUtilsService.showActionNotification(msg, MessageType.Read);
        }
      })
      // this.layoutUtilsService.showActionNotification(_sendMessage, MessageType.Update);
    });

    // this.store.dispatch(new EmailInvoiceToParticipant({invoice: id }));
  }

  downloadInvoice(link: string) {
    // this.store.dispatch(new GenerateInvoice({invoice: invoice }));
    window.open(link, "_blank");
  }

  downloadFile(item) {
    const title = 'Download File';
    const description = 'Are you sure to download this file?';
    const waitDesciption = 'File is downloading...';
    const downloadMessage = `File has been downloaded`;

    const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.auth.downloadFile(item.id).subscribe(res => {
        const link = document.createElement('a');

        // document.body.appendChild('a');
        const blob: any = new Blob([res], { type: res.type });
        const url = window.URL.createObjectURL(blob);

        link.href = url;
        link.download = item.filename;
        link.click();
        window.URL.revokeObjectURL(url);
      });

      this.layoutUtilsService.showActionNotification(downloadMessage, MessageType.Delete);
    });
  }

  deleteTime(timeEntry, billableItem) {
    const _title: string = 'Time Entry Delete';
    const _description: string = 'Are you sure you want to permanently delete this Time Entry?';
    const _waitDescription: string = 'Time Entry is deleting..';
    const _deleteMessage: string = 'Time Entry has been deleted';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.time.deleteBillableItemOfTimeEntries(timeEntry, billableItem).subscribe(res => {
        if (res.success) {
          this.toastr.success("Billable Item has been deleted successfully", 'Success', {
            timeOut: 5000
          });
          this.getAppointmentDetailsById(timeEntry.appointmentId);
        }
      })
    });
  }

  getAppointmentDetailsById(id){
    this.appointment.getAppointmentDetails(id).subscribe(res=>{
      if(res){
      this.appointmentDetails = res.data;
      this.timeEntries = this.appointmentDetails.timeEntries;
      if(this.appointmentDetails.invoice){
        this.invoiceCreated = true;
        this.invoiceDetails = this.appointmentDetails.invoice;
      }
      if(this.appointmentDetails && this.appointmentDetails.address &&  this.appointmentDetails.address.latitude){
        this.locationSrc = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDIwpPULzDj2lIZflF0uUGlxCckz4vxJ_s&q="+this.appointmentDetails.address.latitude+","+this.appointmentDetails.address.longitude+"&zoom=17";
        }else{
          this.locationSrc = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDIwpPULzDj2lIZflF0uUGlxCckz4vxJ_s&q=-31.953512,115.857048&zoom=17";
      }
      this.findDuration(this.appointmentDetails);
      }
      
    })
  }

  toggleNotes() {

    this.showNotes = !this.showNotes;
    // CHANGE THE NAME OF THE BUTTON.
    if (this.showNotes)
      this.visibilityIcon = "visibility_off";
    else
      this.visibilityIcon = "visibility";
  }

}
