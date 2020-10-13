import {
	Component, OnInit, ViewChild, Inject,
	ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query
} from '@angular/core';
import { animate, state, style, transition, trigger, query } from '@angular/animations';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';

import {
	Invoice,
	InvoiceDataSource,
	InvoiceDeleted,
	InvoicesPageRequested,
} from '../../../core/auth';
import { SubheaderService } from '../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../core/_base/crud';

@Component({
	selector: 'kt-invoice-view',
	templateUrl: './invoice-list.component.html',
	styleUrls: ['./invoice-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class InvoiceListComponent implements OnInit, OnDestroy {
	// dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	dataSource: InvoiceDataSource;
	displayedColumns = ['id', 'date', 'type', 'reference', 'billedTo', 'client', 'total', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	lastQuery: QueryParamsModel;
	invoicesResult: Invoice[] = [];
	invoiceshasItems: boolean = false;

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
				this.loadInvoicesList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(1500), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.loadInvoicesList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		this.subheaderService.setTitle('Billing');

		this.dataSource = new InvoiceDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.invoicesResult = res;
			if (this.invoicesResult.length == 0) {
				this.invoiceshasItems = false;
			} else {
				this.invoiceshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadInvoicesList();
		});
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadInvoicesList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new InvoicesPageRequested({ page: queryParams }));
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.name = searchText;
		return filter;
	}

	deleteInvoice(_item: Invoice) {
		const _title: string = 'Invoice Delete';
		const _description: string = 'Are you sure you want to permanently delete this Invoice?';
		const _waitDescription: string = 'Invoice is deleting..';
		const _deleteMessage: string = 'Invoice has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new InvoiceDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	viewInvoice(id) {
		this.router.navigate(['../billing-details', id], { relativeTo: this.activatedRoute });
	}
}
