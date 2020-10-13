import {
	Component, OnInit, ViewChild,
	ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { animate, state, style, transition, trigger, query } from '@angular/animations';
import { MatSort, MatDialog, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, of, Subscription } from 'rxjs';

import {
	Time,
	TimeDataSource,
	TimeDeleted,
	TimesPageRequested,
} from '../../../core/auth';
import { SubheaderService } from '../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
	selector: 'kt-timeEntry-view',
	templateUrl: './timeEntry-list.component.html',
	styleUrls: ['./timeEntry-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class TimeEntriesComponent implements OnInit, OnDestroy {
	dataSource: TimeDataSource;
	displayedColumns = ['id', 'name', 'createdByUserName', 'patientName', 'carePlanName', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	lastQuery: QueryParamsModel;
	selection = new SelectionModel<Time>(true, []);
	timeEntry: Time[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];

	constructor(
		public dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadTimeEntries();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(1500), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadTimeEntries();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		this.subheaderService.setTitle('Time Entries');

		this.dataSource = new TimeDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.timeEntry = res;
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadTimeEntries();
		});
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadTimeEntries() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new TimesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.name = searchText;
		return filter;
	}

	deleteTime(_item: Time) {
		const _title: string = 'Time Entry Delete';
		const _description: string = 'Are you sure you want to permanently delete this Time Entry?';
		const _waitDescription: string = 'Time Entry is deleting..';
		const _deleteMessage: string = 'Time Entry has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new TimeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	editTime(id) {
		this.router.navigate(['../timeEntry/edit', id], { relativeTo: this.activatedRoute });
	}

	viewTime(id) {
		this.router.navigate(['../timeEntry-details', id], { relativeTo: this.activatedRoute });
	}
}
