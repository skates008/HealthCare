import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService, AppointmentService } from './../../../core/_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kt-events-dialog',
  templateUrl: './events-dialog.component.html',
  styleUrls: ['./events-dialog.component.scss']
})
export class EventsDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EventsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: AuthService,
    private appointmentService: AppointmentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }
  viewLoading = false;
  loadingAfterSubmit = false;
  eventDetails: any;
  cancelledAppointment: boolean = false;
  appointmentDetails: Object;
  locationSrc: any;
  showNotes: any;
  visibilityIcon:string =  "visibility";
  showInternalNoteDialog: boolean = false;

  ngOnInit() {
    this.loadAppointmentDetails(this.data.eventDetails.id);
  }
  closeDialogBox() {
    this.dialogRef.close();
  }

  loadAppointmentDetails(id) {
    this.appointmentService.getAppointmentDetails(id).subscribe(res => {
      if (res) {
        this.eventDetails = res.data;
        if(this.eventDetails && this.eventDetails.address &&  this.eventDetails.address.latitude){
          this.locationSrc = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDIwpPULzDj2lIZflF0uUGlxCckz4vxJ_s&q="+this.eventDetails.address.latitude+","+this.eventDetails.address.longitude+"&zoom=17";
          }else{
            this.locationSrc = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDIwpPULzDj2lIZflF0uUGlxCckz4vxJ_s&q=-31.953512,115.857048&zoom=14";
          }
      }
    })
  }

  goToAppointmentDetails(eventDetails) {
    this.dialogRef.close({ "appointmentId": eventDetails.id });
  }

  toggleNotes(){

    this.showNotes = !this.showNotes;
    // CHANGE THE NAME OF THE BUTTON.
    if(this.showNotes)
      this.visibilityIcon = "visibility_off";
    else
      this.visibilityIcon = "visibility";
  }


}
