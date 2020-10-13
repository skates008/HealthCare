import { AfterViewInit, AfterViewChecked, Input } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
// RXJS
import { distinctUntilChanged, skip, take, delay } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
// Models
import {
	Note,
	UserNoteDataSource,
	selectUserNoteInStore,
	UserNotePageRequested,
	UserNoteDeleted
} from '../../../../core/auth';
import { SubheaderService } from '../../../../core/_base/layout';
import { NoteEditDialogComponent } from './note-edit/note-edit.dialog.component';
import { UserNoteAddDialogComponent } from './note-add/note-add.dialog.component';

@Component({
	selector: 'kt-usernote-list',
	styleUrls: ['./note-list.component.scss'],
	templateUrl: './note-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class NoteListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: UserNoteDataSource;
	displayedColumns = ['createdByUserName', 'title', 'type', 'text', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@Input() participantId: string;
	// Filter fields
	lastQuery: QueryParamsModel;
	notesResult;
	noteshasItems = false;

	// Subscriptions
	private subscriptions: Subscription[] = [];

	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.dataSource = new UserNoteDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.notesResult = res;
			if (this.notesResult.length === 0) {
				this.noteshasItems = false;
			} else {
				this.noteshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadNotesList();
		});
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load notes list
	 */
	loadNotesList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration()
		);

		this.store.dispatch(new UserNotePageRequested({
			participantId: this.participantId,
			page: queryParams
		}));

		this.store.pipe(select(selectUserNoteInStore)).subscribe(res => {
			if (res.total === 0) {
				this.noteshasItems = false;
				return;
			} else {
				this.noteshasItems = true;
				this.notesResult = res;
			}
		});
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		filter.type = 'external';
		filter.patientId = this.participantId;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete note
	 *
	 * @param _item: Note
	 */
	deleteNote(item: Note) {
		const title = 'Note Delete';
		const description = 'Are you sure to permanently delete this note?';
		const waitDesciption = 'Note is deleting...';
		const deleteMessage = `Note has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new UserNoteDeleted({ userNote: item }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			this.loadNotesList();
		});
	}

	/**
	 * Show add note dialog
	 */
	addNote() {
		const saveMessage = 'Note saved';
		const messageType = MessageType.Create;
		const dialogRef = this.dialog.open(UserNoteAddDialogComponent, {
			width: '900px',
			data: { patientId: this.participantId } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadNotesList();
		});
	}

	/**
	 * @param note: Notes
	 */
	editNote(note) {
		const saveMessage = 'Note saved';
		const messageType = MessageType.Update;
		const dialogRef = this.dialog.open(NoteEditDialogComponent, {
			data: { note } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadNotesList();
		});
	}
}
