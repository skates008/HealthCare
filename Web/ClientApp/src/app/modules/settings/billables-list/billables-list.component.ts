import {
	Component, OnInit, ViewChild, Inject,
	ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query
} from '@angular/core';
import { animate, state, style, transition, trigger, query } from '@angular/animations';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';

import {
	BillableItem,
	BillableItemDataSource,
	BillableItemDeleted,
	BillableItemsPageRequested,
	Participant,
	selectAllRoles,
	Role,
	ParticipantsPageRequested
} from './../../../core/auth';
import { AuthService, BillableitemService } from './../../../core/_services';
import { SubheaderService } from './../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { selectAllParticipants, selectParticipantsInStore } from './../../../core/auth/_selectors/participant.selectors';

@Component({
	selector: 'kt-billables-view',
	templateUrl: './billables-list.component.html',
	styleUrls: ['./billables-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class BillableItemsListComponent implements OnInit, OnDestroy {
	dataSource: BillableItemDataSource;
	displayedColumns = ['id', 'isBillable', 'name', 'price', 'ndisNumber', 'unit', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	selection = new SelectionModel<BillableItem>(true, []);
	BillableItemsResult: BillableItem[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];
	billablehasItems: boolean = false;

	constructor(
		public dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private auth: AuthService,
		private billableitemService: BillableitemService,
		private cdr: ChangeDetectorRef) { }


	ngOnInit() {
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadBillableItemsList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(1500), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.loadBillableItemsList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		this.subheaderService.setTitle('Billable Items');

		this.dataSource = new BillableItemDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.BillableItemsResult = res;
			if (this.BillableItemsResult) {
				this.billablehasItems = false;
			} else {
				this.billablehasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadBillableItemsList();
		});
		// this.dataSource.sort = this.sort;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadBillableItemsList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new BillableItemsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.name = searchText;
		filter.ndisNumber = searchText;
		return filter;
	}

	deleteBillableItem(_item: BillableItem) {
		const _title: string = 'Bilable Item Delete';
		const _description: string = 'Are you sure you want to permanently delete this Billable Item?';
		const _waitDescription: string = 'Billable Item is deleting..';
		const _deleteMessage: string = 'Billable Item has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.billableitemService.deleteBillableItem(_item.id ).subscribe(res=>{
				if(res){
				this.loadBillableItemsList();
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			})
		});
	}


	editBillableItem(id) {
		this.router.navigate(['../billableItems/edit', id], { relativeTo: this.activatedRoute });
	}

	// viewBillableItem(id) {
	// 	this.router.navigate(['../billableItem-details', id], { relativeTo: this.activatedRoute });
	// }

}
