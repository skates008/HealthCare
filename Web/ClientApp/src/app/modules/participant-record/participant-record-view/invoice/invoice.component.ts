import {
	Component, OnInit, ViewChild, ElementRef,
	ChangeDetectorRef, OnDestroy, Input
} from '@angular/core';
import { MatSort, MatDialog, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { distinctUntilChanged, skip, take, delay, tap } from 'rxjs/operators';
import { of, Subscription, merge } from 'rxjs';

import {
	Invoice,
	InvoiceDataSource,
	InvoicesPageRequested,
	selectInvoicesInStore,
} from '../../../../core/auth';
import { SubheaderService } from '../../../../core/_base/layout';
import { QueryParamsModel } from '../../../../core/_base/crud';

@Component({
	selector: 'kt-participant-invoice',
	templateUrl: './invoice.component.html',
	styleUrls: ['./invoice.component.scss'],
})

export class InvoiceComponent implements OnInit, OnDestroy {
	// dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	dataSource: InvoiceDataSource;
	displayedColumns = ['id', 'date', 'type', 'reference', 'billedTo', 'client', 'total', 'actions'];
	@Input() ndisNumber: string;

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	lastQuery: QueryParamsModel;
	invoicesResult: Invoice[] = [];
	invoiceshasItems = false;

	// Subscriptions
	private subscriptions: Subscription[] = [];

	constructor(
		public dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadInvoicesList();
			})
		).subscribe();

		this.subscriptions.push(paginatorSubscriptions);
		this.dataSource = new InvoiceDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.invoicesResult = res;
			if (this.invoicesResult.length === 0) {
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

		this.store.dispatch(new InvoicesPageRequested({
			page: queryParams
		}));
	}

	filterConfiguration(): any {
		const filter: any = {};
		filter.name = this.ndisNumber;
		return filter;
	}

	viewInvoice(id) {
		this.router.navigate(['../../../../billing/billing-details/', id], { relativeTo: this.activatedRoute });
	}
}
