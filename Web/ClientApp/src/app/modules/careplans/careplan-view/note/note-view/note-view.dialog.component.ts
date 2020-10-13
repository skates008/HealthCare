// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Observable, of, Subscription} from 'rxjs';
import { Store, } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// Services and Models
import {
	Note, UserNote
} from '../../../../../core/auth';
import { NoteService } from './../../../../../core/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'kt-careplan-note-view-dialog',
	templateUrl: './note-view.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CareplanNoteViewDialogComponent implements OnInit, OnDestroy {
	// Public properties
	note: UserNote;
	note$: Observable<UserNote>;
	hasFormErrors = false;
	viewLoading = false;
	loadingAfterSubmit = false;
	roleslist;
	// Private properties
	private componentSubscriptions: Subscription;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<NoteViewDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		public dialogRef: MatDialogRef<CareplanNoteViewDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private noteService: NoteService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// const id = this.data.id;
		this.note = this.data.note;
		// console.log('note: ', this.note);
		// if (id) {
		// 		this.noteService.getUserNoteById(id).subscribe(res => {
		// 			if (res) {
		// 				this.note = res.data;
		// 			}
		// 		});
		// 	}
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}


	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
			// tslint:disable-next-line:no-string-throw
			return `View note`;
			// ${this.data.note.title}
	}

	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	editNote(id) {
		this.router.navigate(['../notes/edit', id], { relativeTo: this.activatedRoute });
	}
}
