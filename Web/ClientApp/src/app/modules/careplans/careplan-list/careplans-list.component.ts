import {
	Component, OnInit, ViewChild,
	ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort, MatDialog, MatPaginator, PageEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, of, Subscription } from 'rxjs';

import {
	Careplan,
	CareplanDataSource,
	CareplanDeleted,
	CareplansPageRequested,
} from '../../../core/auth';
import { SubheaderService } from '../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
	selector: 'kt-careplans-view',
	templateUrl: './careplans-list.component.html',
	styleUrls: ['./careplans-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('1225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class CareplansListComponent implements OnInit, OnDestroy {
	 // MatPaginator Output
	pageEvent: PageEvent;
	dataSource: CareplanDataSource;
	displayedColumns = ['status', 'ndisNumber', 'title', 'Participant', 'availableBudget', 'start', 'end', 'reviewDate', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	selection = new SelectionModel<Careplan>(true, []);
	careplansResult: Careplan[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];

	careplanshasItems: boolean = false;

	constructor(
		public dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService) {
		}


	ngOnInit() {
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadCareplansList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(1500), // reduce server requests by setting a max of request every 1500ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.loadCareplansList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Care Plans');

		this.dataSource = new CareplanDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.careplansResult = res;
			if (this.careplansResult.length == 0) {
				this.careplanshasItems = false;
			} else {
				this.careplanshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadCareplansList();
		});
		// this.dataSource.sort = this.sort;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadCareplansList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new CareplansPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.name = searchText;
		return filter;
	}

	deleteCareplan(item: Careplan) {
		const title: string = 'Care plan Delete';
		const description: string = 'Are you sure you want to permanently delete this Care plan?';
		const waitDescription: string = 'Care plan is deleting..';
		const deleteMessage: string = 'Care plan has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new CareplanDeleted({ id: item}));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			this.loadCareplansList();
		});
	}

	editCareplan(id) {
		this.router.navigate(['../Careplans/edit', id], { relativeTo: this.activatedRoute });
	}

	viewCareplan(Careplan) {
		this.router.navigate(['../careplan-details', Careplan.id], { relativeTo: this.activatedRoute , state : {
			Careplan: Careplan
		}});
	}

	viewParticipant(id) {
		this.router.navigate(['../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
