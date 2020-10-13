// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// Material
import { MatDialogRef,
	MAT_DIALOG_DATA,
	MatDatepicker } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// CRUD
import { TypesUtilsService, LayoutUtilsService } from '../../../../../core/_base/crud';
// Services and Models
import {
	Agreement,
	AgreementOnServerCreated,
	selectAgreementActionLoading,
	AuthService,
	selectAgreementIsSuccess,
} from '../../../../../core/auth';

import moment from 'moment';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { AgreementService } from '../../../../../core/_services';

@Component({
	selector: 'kt-agreement-add-dialog',
	templateUrl: './agreement-add.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class AgreementAddDialogComponent implements OnInit, OnDestroy {
	// Public properties
	agreement: Agreement;
	agreementForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	participantId;
	// Private properties
	private componentSubscriptions: Subscription;
	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;

	public uploader: FileUploader = new FileUploader({});
  	public hasBaseDropZoneOver = false;
	hasAnotherDropZoneOver: boolean;
	response:string;
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
		public dialogRef: MatDialogRef<AgreementAddDialogComponent>,
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
		this.store.pipe(select(selectAgreementActionLoading)).subscribe(res => this.viewLoading = res);
		this.participantId = this.data.patientId;
		this.createForm();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	// onFileSelected(value) {

	// 	let i: number;

	// 	console.log(value);
	// 	console.log('uploader', this.uploader.queue.length);
	// 	let _arr = <FormArray> this.agreementForm.get('fileTitles');
 
	// 	for (i = 1; i <= this.uploader.queue.length; i++) {
	// 		let title = { i : ['']};
	// 		 let _fg = this.fb.group({
	// 			title
	// 		});
	// 		_arr.push(_fg);
	// 	}
	// 	console.log('array:', _arr);
	// }

	createForm() {
		this.agreementForm = this.fb.group({
			title: ['', Validators.required],
			notes: ['', Validators.required],
			signedDate: [new Date(), Validators.required],
			validFromDate: [new Date(), Validators.required],
			validToDate: [new Date(), Validators.required],
			// fileTitles: this.fb.array([
			// 	// this.fb.group({
			// 	// 	title0: [''],
			// 	// 	title1: ['']
			// 	// })
			// ])
			// file:  ['',  Validators.required]
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
		return 'Add New Agreement';
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

	/** ACTIONS */

	/**
	 * Returns prepared agreement
	 */
	prepareAgreement(): any {
		const controls = this.agreementForm.controls;
		const agreement = new Agreement();
		agreement.title = controls.title.value;
		agreement.notes = controls.notes.value;
		agreement.signedDate = controls.signedDate.value;
		agreement.validFromDate = controls.validFromDate.value;
		agreement.validToDate = controls.validToDate.value;
		agreement.patientId = this.participantId;
		return agreement;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		const formData =  new FormData();
		const files = this.getFiles();

		console.log(files);

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
		};

		// tslint:disable-next-line: forin
		for ( const key in obj ) {
			formData.append(key, obj[key]);
		}

		this.createAgreement(formData);
	}

	/**
	 * Create agreement
	 *
	 * @param _agreement: AgreementModel
	 */
	createAgreement(formData) {
		this.store.dispatch(new AgreementOnServerCreated({ agreement: formData, id: this.participantId  }));
		this.componentSubscriptions = this.store.pipe(
			select(selectAgreementIsSuccess),
		).subscribe(success => {
			if (!success) {
				return;
			}

			this.dialogRef.close({ formData, isEdit: false });
		});
	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
