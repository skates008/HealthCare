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
	Files,
	FileDataSource,
	FileDeleted,
	FilePageRequested,
	selectFileInStore,
} from '../../../../core/auth';
import { SubheaderService } from '../../../../core/_base/layout';
import { UserFileService } from '../../../../core/_services';

@Component({
	selector: 'kt-file-list',
	styleUrls: ['./file-list.component.scss'],
	templateUrl: './file-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class FileListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: FileDataSource;

	displayedColumns = ['title', 'type', 'createdByName', 'createdDate', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@Input() participantId: string;
	// Filter fields
	lastQuery: QueryParamsModel;
	notesResult;
	fileshasItems = false;

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
		private service: UserFileService,
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
		this.dataSource = new FileDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.notesResult = res;
			if (this.notesResult.length === 0) {
				this.fileshasItems = false;
			} else {
				this.fileshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadFilesList();
		});
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load files list
	 */
	loadFilesList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration()
		);

		this.store.dispatch(new FilePageRequested({
			participantId: this.participantId,
			page: queryParams
		}));

		this.store.pipe(select(selectFileInStore)).subscribe(res => {
			if (res.total === 0) {
				this.fileshasItems = false;
				return;
			} else {
				this.fileshasItems = true;
				this.notesResult = res.data;
			}
		});
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete file
	 *
	 * @param _item: File
	 */
	deleteFile(item: Files) {
		const title = 'File Delete';
		const description = 'Are you sure to permanently delete this file?';
		const waitDesciption = 'File is deleting...';
		const deleteMessage = `File has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new FileDeleted({ file: item }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			this.loadFilesList();
		});
	}

	downloadFile(item: Files) {
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
			this.loadFilesList();
		});
	}
}
