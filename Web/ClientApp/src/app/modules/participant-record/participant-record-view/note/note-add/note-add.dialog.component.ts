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
	selectUserNoteActionLoading,
	selectUserNoteIsSuccess,
	UserNote,
	UserNoteOnServerCreated,
} from '../../../../../core/auth';

import { FileUploader, FileLikeObject } from 'ng2-file-upload';

@Component({
	selector: 'kt-note-add-dialog',
	templateUrl: './note-add.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class UserNoteAddDialogComponent implements OnInit, OnDestroy {
	// Public properties
	note: UserNote;
	noteForm: FormGroup;
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
	 * @param dialogRef: MatDialogRef<NoteEditDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(
		public dialogRef: MatDialogRef<UserNoteAddDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
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
		this.store.pipe(select(selectUserNoteActionLoading)).subscribe(res => this.viewLoading = res);
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
		this.noteForm = this.fb.group({
			title: ['', Validators.required],
			text: ['', Validators.required],
			type: ['', Validators.required],
		});
	}


	/**
	 * Returns page title
	 */
	getTitle(): string {
		return 'Add New Note';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.noteForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared note
	 */
	prepareNote(): any {
		const controls = this.noteForm.controls;
		const note = new UserNote();
		note.title = controls.title.value;
		note.text = controls.text.value;
		note.type = controls.type.value;
		note.patientId = this.participantId;
		return note;
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
		const controls = this.noteForm.controls;
		/** check form */
		if (this.noteForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const obj = {
		title: controls.title.value,
		text: controls.text.value,
		type: controls.type.value,
		patientId: this.participantId,
		};

		// tslint:disable-next-line: forin
		for ( const key in obj ) {
			formData.append(key, obj[key]);
		}

		this.createNote(formData);
	}

	/**
	 * Create note
	 *
	 * @param _note: NoteModel
	 */
	createNote(formData) {
		this.store.dispatch(new UserNoteOnServerCreated({ userNote: formData, id: this.participantId  }));
		this.componentSubscriptions = this.store.pipe(
			select(selectUserNoteIsSuccess),
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
