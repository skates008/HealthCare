import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppointmentService } from './../../../../core/_services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'kt-recurring-appointments-dialog',
  templateUrl: './recurring-appointments-dialog.component.html',
  styleUrls: ['./recurring-appointments-dialog.component.scss']
})
export class RecurringAppointmentsDialogComponent implements OnInit {

  updatedAppointmentDetails: any;
  cancelAppointmentDetails: any;
  isException: boolean = true;
  viewLoading = false;
  loadingAfterSubmit = false;
  showCancelAppointment: boolean = false;


  constructor(
    private appointmentService : AppointmentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RecurringAppointmentsDialogComponent>,
  ) { }


  ngOnInit() {
    this.updatedAppointmentDetails = this.data.updateAppointmentDetail;
    if(this.data.cancelDetails){
      this.showCancelAppointment = true;
      this.cancelAppointmentDetails = this.data.cancelDetails;
    }
  }

  updateAppointment(){
    this.updatedAppointmentDetails.recurrence.isException = this.isException;
      this.appointmentService.updateAppointment( this.updatedAppointmentDetails).subscribe(res=>{
        if(res.success){
          this.toastr.success("Appointment updated successfully", 'Success', {
            timeOut: 3000
          });
          this.dialogRef.close();
        }
      })
  }

  cancelAppointment(){
    this.cancelAppointmentDetails.cancelData.recurrence.isException = this.isException;
    this.appointmentService.cancelAppointment(this.cancelAppointmentDetails.id, this.cancelAppointmentDetails.cancelData).subscribe(res => {
      if (res.success) {
        this.toastr.success("Appointment cancelled successfully", 'Success', {
          timeOut: 3000
        });
        this.dialogRef.close();
      }
    })
  }

  closeDialogBox() {
    this.dialogRef.close();
  }


}
