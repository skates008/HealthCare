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
	Time,
	TimeDataSource,
	TimeDeleted,
	TimesPageRequested,
	Participant,
	selectAllRoles,
	Role,
	ParticipantsPageRequested,
	StatementPageRequested,
	selectTimesInStore
} from './../../../core/auth';
import { SubheaderService } from './../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { selectAllParticipants, selectParticipantsInStore } from './../../../core/auth/_selectors/participant.selectors';

@Component({
	selector: 'kt-statements-view',
	templateUrl: './statements-list.component.html',
	styleUrls: ['./statements-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class StatementsListComponent implements OnInit, OnDestroy {
	// dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	dataSource: TimeDataSource;
	displayedColumns = ['select', 'id', 'carePlanName', 'timeEntryName', 'timeEntryDate', 'totalCost', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<Time>(true, []);
	StatementsResult: Time[] = [];

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
		// load participants 
		// this.loadParticipants();
		
		// const participantsSubscription = this.store.pipe(select(selectAllParticipants)).subscribe(res => this.allParticipants = res);
		// this.subscriptions.push(participantsSubscription);

		// console.log('All Participants:', this.allParticipants)

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadStatementsList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(150), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadStatementsList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		this.subheaderService.setTitle('Statement Management');

		this.dataSource = new TimeDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			if(res){
			this.StatementsResult = res;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadStatementsList();
		});
		// this.dataSource.sort = this.sort;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadStatementsList() {
		this.selection.clear();
		// this.store.dispatch(new TimesPageRequested({ page: queryParams }));
		this.store.dispatch(new StatementPageRequested());
		// this.store.pipe(select(selectTimesInStore)).subscribe(res =>{ 
		// 	console.log("res123", res);
		// });
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.name = searchText;
		return filter;
	}

	deleteStatement(_item: Time) {
		const _title: string = 'Statement Delete';
		const _description: string = 'Are you sure you want to permanently delete this Statement?';
		const _waitDescription: string = 'Statement is deleting..';
		const _deleteMessage: string = 'Statement has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new TimeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	fetchStatements() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.participant}, ${elem.business}`,
				id: elem.id.toString()
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.StatementsResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.StatementsResult.length) {
			this.selection.clear();
		} else {
			this.StatementsResult.forEach(row => this.selection.select(row));
		}
	}


	// editStatement(id) {
	// 	this.router.navigate(['../statement/edit', id], { relativeTo: this.activatedRoute });
	// }

	viewStatement(id) {
		this.router.navigate(['../statement-details', id], { relativeTo: this.activatedRoute });
	}

	viewParticipant(id) {
		this.router.navigate(['../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
