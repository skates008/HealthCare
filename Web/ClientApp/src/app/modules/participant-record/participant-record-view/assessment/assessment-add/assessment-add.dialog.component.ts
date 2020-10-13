// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
	Assessment,
	AssessmentOnServerCreated,
	selectAssessmentActionLoading,
	selectAssessmentIsSuccess,
} from '../../../../../core/auth';

import moment from 'moment';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { AssessmentService } from '../../../../../core/_services';

@Component({
	selector: 'kt-assessment-add-dialog',
	templateUrl: './assessment-add.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class AssessmentAddDialogComponent implements OnInit, OnDestroy {
	// Public properties
	assessment: Assessment;
	assessmentForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
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
	 * @param dialogRef: MatDialogRef<AssessmentEditDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(
		public dialogRef: MatDialogRef<AssessmentAddDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private service: AssessmentService,
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
		this.store.pipe(select(selectAssessmentActionLoading)).subscribe(res => this.viewLoading = res);
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

	createForm() {
		this.assessmentForm = this.fb.group({
			title: ['', Validators.required],
			notes: ['', Validators.required],
			assessmentDate: [new Date(), Validators.required],
			validFromDate: [new Date(), Validators.required],
			validToDate: [new Date(), Validators.required],
			assessor: ['', Validators.required],
			// file:  ['',  Validators.required]
		});
	}

	get f() {
		return  this.assessmentForm.controls;
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
		return 'Add New Assessment';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.assessmentForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared assessment
	 */
	prepareAssessment(): any {
		const controls = this.assessmentForm.controls;
		const assessment = new Assessment();
		assessment.title = controls.title.value;
		assessment.notes = controls.notes.value;
		assessment.assessmentDate = controls.assessmentDate.value;
		assessment.validFromDate = controls.validFromDate.value;
		assessment.validToDate = controls.validToDate.value;
		assessment.assessor = controls.assessor.value;
		assessment.patientId = this.participantId;
		return assessment;
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
		const controls = this.assessmentForm.controls;
		/** check form */
		if (this.assessmentForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const obj = {
		title: controls.title.value,
		notes: controls.notes.value,
		assessmentDate: moment(controls.assessmentDate.value).format('YYYY-MM-DDTHH:mm:ss.SSS'),
		validFromDate: moment(controls.validFromDate.value).format('YYYY-MM-DDTHH:mm:ss.SSS'),
		validToDate: moment(controls.validToDate.value).format('YYYY-MM-DDTHH:mm:ss.SSS'),
		assessor: controls.assessor.value
		};

		// tslint:disable-next-line: forin
		for ( const key in obj ) {
			formData.append(key, obj[key]);
		}

		this.createAssessment(formData);
	}

	/**
	 * Create assessment
	 *
	 * @param _assessment: AssessmentModel
	 */
	createAssessment(formData) {
		this.store.dispatch(new AssessmentOnServerCreated({ assessment: formData, id: this.participantId  }));
		this.componentSubscriptions = this.store.pipe(
			select(selectAssessmentIsSuccess),
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
