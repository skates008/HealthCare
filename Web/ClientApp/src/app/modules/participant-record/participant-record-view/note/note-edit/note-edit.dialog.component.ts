// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ViewChild, NgZone } from '@angular/core';
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
	UserNoteFileDeleted,
	UserNote
} from '../../../../../core/auth';
import { FileLikeObject, FileUploader } from 'ng2-file-upload';
import moment from 'moment';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { UserNoteService } from '../../../../../core/_services';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-note-edit-dialog',
	templateUrl: './note-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class NoteEditDialogComponent implements OnInit, OnDestroy {
	// Public properties
	note: UserNote;
	noteForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	noteId;
	participantId;
	// Private properties
	private componentSubscriptions: Subscription;
	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	@ViewChild('autosize', { static: true }) autosize: CdkTextareaAutosize;

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
		public dialogRef: MatDialogRef<NoteEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private service: UserNoteService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private ngZone: NgZone,
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
		this.noteForm = this.fb.group({
			title: ['', Validators.required],
			text: ['', Validators.required],
			type: ['', Validators.required],
		});

		this.noteId = this.data.note.id;
		this.participantId = this.data.note.patientId;

		this.loadNoteDetails();

	}

	triggerResize() {
		// Wait for changes to be applied, then trigger textarea resize.
		this.ngZone.onStable.pipe(take(1))
			.subscribe(() => this.autosize.resizeToFitContent(true));
	}

	loadNoteDetails() {
		// called service directly coze store was causing some issue with loading data.
		this.service.getUserNoteById(this.noteId, this.participantId).subscribe(res => {
			if (res.success) {
				this.note = res.data;
				this.noteForm.patchValue({
					id: this.note.id,
					title: this.note.title,
					text: this.note.text,
					type: this.note.type,
				});
				this.createForm(this.note);
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
		this.noteForm = this.fb.group({
			id: [''],
			title: [note.title, Validators.required],
			text: [note.text, Validators.required],
			type: [note.type, Validators.required],
			// fileToUpload:  ['']
		});
	}


	/**
	 * Returns page title
	 */
	getTitle(): string {
			return `Edit Note`;
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
			id: this.note.id
			};

		// tslint:disable-next-line: forin
		for ( const key in obj ) {
			formData.append(key, obj[key]);
		}

		const noteId = this.note.id;

		this.updateNote(formData, this.participantId, noteId);
	}

	/**
	 * Update note
	 *
	 * @param _note: NoteModel
	 */
	updateNote(note, id, noteId) {
		this.service.updateUserNote(note, id, noteId).subscribe(res => {
			if (res.success) {
				const message = `Note has been successfully updated.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
			}
			this.dialogRef.close({ note, isEdit: false });
		});
	}

	/** ACTIONS */
	/**
	 * Delete note
	 *
	 * @param _item: Note
	 */
	deleteNoteFile(value) {
		const title = 'File Delete';
		const description = 'Are you sure to permanently delete this file?';
		const waitDesciption = 'File is deleting...';
		const deleteMessage = `File has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
			this.store.dispatch(new UserNoteFileDeleted({ id: value }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			this.loadNoteDetails();
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
