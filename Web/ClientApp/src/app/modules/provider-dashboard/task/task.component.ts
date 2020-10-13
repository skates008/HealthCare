// Angular
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
// RXJS
import { tap, skip, distinctUntilChanged, take, delay } from 'rxjs/operators';
import { merge, Subscription, of } from 'rxjs';
// Crud
import { QueryParamsModel } from './../../../core/_base/crud';
// Layout
import { DataTableItemModel, DataTableService } from './../../../core/_base/layout';
import {
	TasksPageRequested,
	TaskDataSource,
	Task
} from './../../../core/auth';
import { AppState } from './../../../core/reducers';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'kt-data-task',
	templateUrl: './task.component.html',
	styleUrls: ['./task.component.scss']
})
export class DataTaskComponent implements OnInit {
	// Public properties
	private subscriptions: Subscription[] = [];
	dataSource: TaskDataSource;
	tasksResult: Task[] = [];
	displayedColumns = ['dueDate', 'title', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	selection = new SelectionModel<DataTableItemModel>(true, []);
	bookedAppointments: any;
	taskshasItems: boolean = false;

	/**
	 * Component constructor
	 *
	 * @param dataTableService: DataTableService
	 */
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadTasksList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Init DataSource
		this.dataSource = new TaskDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.tasksResult = res;
			if (this.tasksResult.length == 0) {
				this.taskshasItems = false;
			} else {
				this.taskshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadTasksList();
		});
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
		const searchText: string = '';
		filter.name = searchText;
		return filter;
	}

	viewTask(id) {
		this.router.navigate(['../tasks/task-details', id], { relativeTo: this.activatedRoute });
	}

}
