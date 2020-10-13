import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	Input
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

// NGRX
import { Store, select } from "@ngrx/store";
import { TimeEntryDetailsByID, selectTimesInStore} from "./../../../core/auth";
import { AuthService, InvoiceService, TimeService } from './../../../core/_services';
// Layout config

//Angular Material
import { AppState } from './../../../core/reducers';
import { SubheaderService } from './../../../core/_base/layout';
import { Location } from '@angular/common';
import { MessageType, LayoutUtilsService } from './../../../core/_base/crud';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kt-timeEntry-view',
  templateUrl: './timeEntry-view.component.html',
  styleUrls: ['./timeEntry-view.component.scss']
})
export class TimeEntryViewComponent implements OnInit {

	@Input() data: { labels: string[]; datasets: any[] };
	@Input() type: string = "line";
	@ViewChild("chart", { static: true }) chart: ElementRef;
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param layoutConfigService
	 */

	time: any;
	// viewLoading: boolean = false;
	// loadingAfterSubmit: boolean = false;
	billableItemsList: any;
	invoiceCreated: boolean = false;
	invoiceCreateId :string;
	invoiceDetails: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private subheaderService: SubheaderService,
		private store: Store<AppState>,
		private _location: Location,
		private auth: AuthService,
		private invoiceService: InvoiceService,
		private timeService: TimeService,
		private toastr: ToastrService,
		private layoutUtilsService: LayoutUtilsService,
  ) {

   }

	ngOnInit() {
		this.initTimeEntry()
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				const id = params["id"];
				if (id) {
					this.loadTimeEntryDetails(id);
				}
			}
		);
	}

	initTimeEntry() {
		this.subheaderService.setTitle('Time Entry');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Time Entry Details' }
		]);
	}

	edit(id) {
		this.router.navigate(["../../timeEntry/edit", id], {
			relativeTo: this.activatedRoute
		});
	}

	viewParticipant(id) {
		this.router.navigate(['../../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}

	back(){
		this._location.back()
	}
	createInvoice(apptDetails){
		if(apptDetails.appointmentId!= "00000000-0000-0000-0000-000000000000"){
		 this.invoiceCreateId = apptDetails.appointmentId;
		 this.invoiceService.createInvoiceFromAppointment(this.invoiceCreateId).subscribe(res=>{
			if(res.success){
			  this.invoiceCreated = true;
			  this.invoiceDetails = res.data[0];
			  this.toastr.success("Invoice successfully has been created", 'Success', {
			    timeOut: 5000
			  });
			}
		  })
		}else{
			this.invoiceCreateId = apptDetails.id;
			this.invoiceService.createInvoiceFromTimeentry(this.invoiceCreateId).subscribe(res=>{
				if(res.success){
				  this.invoiceCreated = true;
				  this.invoiceDetails = res.data[0];
				  this.toastr.success("Invoice successfully has been created", 'Success', {
				    timeOut: 5000
				  });
				}
			  })
		}

	  }


  sendEmailToParticipant(id){
	const _title: string = `Email Invoice to ${this.invoiceDetails.customerName}` ;
	const _description: string = 'Are you sure you want to email this invoice ?';
	const _waitDescription: string = 'Please wait the invoice is being sent..';
	const _sendMessage: string = 'Invoice has been sent';

	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
	dialogRef.afterClosed().subscribe(res => {
		if (!res) {
			return;
		}
		this.invoiceService.sendInvoice(id).subscribe(res => {
			if(res.success){
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

loadTimeEntryDetails(id) {
	this.store.dispatch(new TimeEntryDetailsByID({ timeEntryId: id  }));
	this.store.pipe(select(selectTimesInStore)).subscribe(res => {
		if (res.data.length) {
			this.time = res.data[0];
			this.billableItemsList = this.time.billableItems;
		}
		if (this.time && this.time.invoice != null){
			this.invoiceCreated = true;
			this.invoiceDetails = this.time.invoice;
		}
	});
}

downloadInvoice(link: string){
	// this.store.dispatch(new GenerateInvoice({invoice: invoice }));
	window.open(link, "_blank");
}

deleteTime(timeEntry,billableItem) {
	const _title: string = 'Time Entry Delete';
	const _description: string = 'Are you sure you want to permanently delete this Time Entry?';
	const _waitDescription: string = 'Time Entry is deleting..';
	const _deleteMessage: string = 'Time Entry has been deleted';

	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
	dialogRef.afterClosed().subscribe(res => {
		if (!res) {
			return;
  		}

  this.timeService.deleteBillableItemOfTimeEntries(timeEntry, billableItem).subscribe(res => {
	  if(res.success) {
		this.toastr.success("Billable Item  has been deleted successfully", 'Success', {
			timeOut: 5000
		  });
		  this.loadTimeEntryDetails(timeEntry.id);
	  }
	// this.getAppointmentDetailsById(timeEntry.appointmentId);
	// if(res){
	// 	loadTimeEntryDetails

	// }

  })
	});
}


}
