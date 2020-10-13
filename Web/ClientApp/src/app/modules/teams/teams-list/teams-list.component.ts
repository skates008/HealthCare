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
	Team,
	TeamDataSource,
	TeamDeleted,
	TeamsPageRequested,
	Participant,
	selectAllRoles,
	Role,
	ParticipantsPageRequested
} from './../../../core/auth';
import { SubheaderService } from './../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { selectAllParticipants, selectParticipantsInStore } from './../../../core/auth/_selectors/participant.selectors';

@Component({
	selector: 'kt-teams-view',
	templateUrl: './teams-list.component.html',
	styleUrls: ['./teams-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class TeamsListComponent implements OnInit, OnDestroy {
	// dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	dataSource: TeamDataSource;
	displayedColumns = [ 'name', 'therapist', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<Team>(true, []);
	TeamsResult: Team[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];

	name: string;
	allRoles: Role[] = [];

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
				this.loadTeamsList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(1500), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.loadTeamsList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		this.subheaderService.setTitle('Teams');

		this.dataSource = new TeamDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.TeamsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadTeamsList();
		});
		// this.dataSource.sort = this.sort;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadTeamsList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new TeamsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.name = searchText;
		return filter;
	}

	deleteTeam(item: Team) {
		const title: string = 'Team Delete';
		const description: string = 'Are you sure you want to permanently delete this Team?';
		const waitDescription: string = 'Team is deleting..';
		const deleteMessage: string = 'Team has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new TeamDeleted({ id: item.id }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
		});
	}

	fetchTeams() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.name}`,
				id: elem.id.toString()
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.TeamsResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.TeamsResult.length) {
			this.selection.clear();
		} else {
			this.TeamsResult.forEach(row => this.selection.select(row));
		}
	}

	editTeam(id) {
		this.router.navigate(['../Teams/edit', id], { relativeTo: this.activatedRoute });
	}

	viewTeam(id) {
		this.router.navigate(['../team-details', id], { relativeTo: this.activatedRoute });
	}

	viewParticipant(id) {
		this.router.navigate(['../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
