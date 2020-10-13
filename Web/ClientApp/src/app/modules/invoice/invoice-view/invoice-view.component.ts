import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	Input,
	Inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// NGRX
import { Store, select } from '@ngrx/store';
import { InvoiceService } from './../../../core/_services';

// Layout config

// Angular Material
import { MatDialog } from '@angular/material';
import { AppState } from './../../../core/reducers';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';

@Component({
  selector: 'kt-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit {

	@Input() data: { labels: string[]; datasets: any[] };
	@Input() type: string = 'line';
	@ViewChild('chart', { static: true }) chart: ElementRef;
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param layoutConfigService
	 */

	loading$: any;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	invoice: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private store: Store<AppState>,
		private service: InvoiceService,
		private layoutUtilsService: LayoutUtilsService,
		private dialog: MatDialog,
		private auth: InvoiceService
  ) { }


	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				const id = params['id'];
				if (id) {
					// console.log('Invoice Id:', id);
					// this.store
					// 	.pipe(select(selectInvoiceById(id)))
					// 	.subscribe(res => {
					// 		if (res) {
					// 			this.task = res;
					// 			console.log('Invoice Data:', this.task);
					// 		}
					// 	});
					this.auth.getInvoice(id).subscribe(res=>{
						if (res.data) {
							this.invoice = res.data;
						}
					})
				}
			}

		);
	}

	edit(id) {

	}

	downloadInvoice(link: string){
		// this.store.dispatch(new GenerateInvoice({invoice: invoice }));
		window.open(link, '_blank');
	}


	sendEmailToParticipant(id){
		const _title: string = `Email Invoice to ${this.invoice.customerName}` ;
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
					const msg = 'Something went wrong ! Please try again'
					this.layoutUtilsService.showActionNotification(msg, MessageType.Read);
				}
			})
			// this.layoutUtilsService.showActionNotification(_sendMessage, MessageType.Update);
		});


		// this.store.dispatch(new EmailInvoiceToParticipant({invoice: id }));
	}

	downloadFile(item) {
		console.log(item);
		const title = 'Download File';
		const description = 'Are you sure to download this file?';
		const waitDesciption = 'File is downloading...';
		const downloadMessage = `File has been downloaded`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.service.downloadFile(item.id).subscribe(res => {
				const link = document.createElement('a');

				// document.body.appendChild('a');
				const blob: any = new Blob([res], {type: res.type});
				const url = window.URL.createObjectURL(blob);

				link.href = url;
				link.download = item.filename;
				link.click();
				window.URL.revokeObjectURL(url);
			});

			this.layoutUtilsService.showActionNotification(downloadMessage, MessageType.Delete);
		});
	}

	getHistory(id) { }

	viewParticipant(id) {
		this.router.navigate(['../../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
