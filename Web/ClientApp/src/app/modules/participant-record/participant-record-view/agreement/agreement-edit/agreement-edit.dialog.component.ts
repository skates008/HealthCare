// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// CRUD
import { TypesUtilsService, LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Services and Models
import {
	Agreement,
	AgreementFileDeleted
} from '../../../../../core/auth';
import { FileLikeObject, FileUploader } from 'ng2-file-upload';
import moment from 'moment';
import { AgreementService } from '../../../../../core/_services';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-agreement-edit-dialog',
	templateUrl: './agreement-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class AgreementEditDialogComponent implements OnInit, OnDestroy {
	// Public properties
	agreement: Agreement;
	agreementForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	agreementId;
	participantId;
	// Private properties
	private componentSubscriptions: Subscription;
	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;

	public uploader: FileUploader = new FileUploader({});
  	public hasBaseDropZoneOver = false;
	hasAnotherDropZoneOver: boolean;

	// files
	files: any[] = [];

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<AgreementEditDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(
		public dialogRef: MatDialogRef<AgreementEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private service: AgreementService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService) {
	}

	getFiles(): FileLikeObject[] {
		return this.uploader.queue.map((fileItem) => {
		  return fileItem.file;
		});
	  }

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	  }

	  public fileOverAnother(e: any): void {
		this.hasAnotherDropZoneOver = e;
	  }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.agreementForm = this.fb.group({
			title: ['', Validators.required],
			notes: ['', Validators.required],
			signedDate: [new Date(), Validators.required],
			validFromDate: [new Date(), Validators.required],
			validToDate: [new Date(), Validators.required],
		});

		this.agreementId = this.data.agreement.id;
		this.participantId = this.data.agreement.patientId;

		this.loadAgreementDetails();

	}

	loadAgreementDetails() {
		// called service directly coze store was causing some issue with loading data.
		this.service.getAgreementById(this.agreementId, this.participantId).subscribe(res => {
			if (res.success) {
				this.agreement = res.data;
				this.agreementForm.patchValue({
					id: this.agreement.id,
					title: this.agreement.title,
					notes: this.agreement.notes,
					signedDate: this.agreement.signedDate,
					validFromDate: this.agreement.validFromDate,
					validToDate: this.agreement.validToDate,
				});
				this.createForm(this.agreement);
			}
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	createForm(note) {
		this.agreementForm = this.fb.group({
			id: [''],
			title: [note.title, Validators.required],
			notes: [note.notes, Validators.required],
			signedDate: [note.signedDate, Validators.required],
			validFromDate: [note.validFromDate, Validators.required],
			validToDate: [note.validToDate, Validators.required],
			// fileToUpload:  ['']
		});
	}

	get f() {
		return  this.agreementForm.controls;
	 }

	 onFileChange(event) {
		// tslint:disable-next-line: prefer-for-of
		for (let i = 0; i < event.target.files.length; i++) {
			this.files.push(event.target.files[i]);
		}
  }

	/**
	 * Returns page title
	 */
	getTitle(): string {
			return `Edit Agreement`;
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.agreementForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		const formData =  new FormData();
		const files = this.getFiles();

		files.forEach((file) => {
			formData.append('files' , file.rawFile, file.name);
		});

		this.hasFormErrors = false;
		const controls = this.agreementForm.controls;
		/** check form */
		if (this.agreementForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const obj = {
			title: controls.title.value,
			notes: controls.notes.value,
			signedDate: moment(controls.signedDate.value).format('YYYY-MM-DDTHH:mm:ss.SSS'),
			validFromDate: moment(controls.validFromDate.value).format('YYYY-MM-DDTHH:mm:ss.SSS'),
			validToDate: moment(controls.validToDate.value).format('YYYY-MM-DDTHH:mm:ss.SSS'),
			id: this.agreement.id
			};

		// tslint:disable-next-line: forin
		for ( const key in obj ) {
			formData.append(key, obj[key]);
		}

		const agreementId = this.agreement.id;

		this.updateAgreement(formData, this.participantId, agreementId);
	}

	/**
	 * Update agreement
	 *
	 * @param _agreement: AgreementModel
	 */
	updateAgreement(agreement, id, agreementId) {
		this.service.updateAgreement(agreement, id, agreementId).subscribe(res => {
			if (res.success) {
				const message = `Agreement has been successfully updated.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
			}
			this.dialogRef.close({ agreement, isEdit: false });
		});
	}

	/** ACTIONS */
	/**
	 * Delete agreement
	 *
	 * @param _item: Agreement
	 */
	deleteAgreementFile(value) {
		const title = 'File Delete';
		const description = 'Are you sure to permanently delete this file?';
		const waitDesciption = 'File is deleting...';
		const deleteMessage = `File has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
			this.store.dispatch(new AgreementFileDeleted({ id: value }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			this.loadAgreementDetails();
			}
		});
	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	downloadFile(item) {
		const title = 'Download File';
		const description = 'Are you sure to download this file?';
		const waitDesciption = 'File is downloading...';
		const deleteMessage = `File has been downloaded`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			// this.store.dispatch(new FileDownload({ id: item.id }));

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

			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
		});
	}

}
