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
	Task,
	TaskDataSource,
	TaskDeleted,
	TasksPageRequested,
	Role,
} from './../../../core/auth';
import { SubheaderService } from './../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
	selector: 'kt-tasks-view',
	templateUrl: './tasks-list.component.html',
	styleUrls: ['./tasks-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class TasksListComponent implements OnInit, OnDestroy {
	// dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	dataSource: TaskDataSource;
	displayedColumns = ['issueDate', 'dueDate', 'title', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<Task>(true, []);
	TasksResult: Task[] = [];
	taskshasItems: boolean = false;

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
				this.loadTasksList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(150), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.loadTasksList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		this.subheaderService.setTitle('Task Management');

		this.dataSource = new TaskDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.TasksResult = res;
			if (this.TasksResult.length == 0) {
				this.taskshasItems = false;
			} else {
				this.taskshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadTasksList();
		});
		// this.dataSource.sort = this.sort;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadTasksList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new TasksPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.name = searchText;
		return filter;
	}

	deleteTask(item: Task) {
		const title: string = 'Task Delete';
		const description: string = 'Are you sure you want to permanently delete this Task?';
		const waitDescription: string = 'Task is deleting..';
		const deleteMessage: string = 'Task has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new TaskDeleted({ id: item.id }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
		});
	}

	fetchTasks() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.title}`,
				id: elem.id.toString()
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.TasksResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.TasksResult.length) {
			this.selection.clear();
		} else {
			this.TasksResult.forEach(row => this.selection.select(row));
		}
	}

	editTask(id) {
		this.router.navigate(['../Tasks/edit', id], { relativeTo: this.activatedRoute });
	}

	viewTask(id) {
		this.router.navigate(['../task-details', id], { relativeTo: this.activatedRoute });
	}

	viewParticipant(id) {
		this.router.navigate(['../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
