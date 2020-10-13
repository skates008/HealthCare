import { Injectable } from '@angular/core';

import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	TaskActionTypes,
	TasksPageRequested,
	TasksPageLoaded,
	TaskCreated,
	TaskDeleted,
	TaskUpdated,
	TaskOnServerCreated,
	TasksActionToggleLoading,
	TasksPageToggleLoading,
	TaskUpdatedResponse
} from '../_actions/task.actions';
import { TaskService } from '../../../core/_services';

@Injectable()
export class TaskEffects {
	showPageLoadingDispatcher = new TasksPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new TasksPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new TasksActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new TasksActionToggleLoading({ isLoading: false });

	@Effect()
	loadTasksPage$ = this.actions$
		.pipe(
			ofType<TasksPageRequested>(TaskActionTypes.TasksPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findTask(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: any = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new TasksPageLoaded({
					tasks: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	updateTask$ = this.actions$
		.pipe(
			ofType<TaskUpdated>(TaskActionTypes.TaskUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.updateTask(payload.task).pipe(
					tap(res => {
						this.store.dispatch(new TaskUpdatedResponse({ task: res }))
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	createTask$ = this.actions$
		.pipe(
			ofType<TaskOnServerCreated>(TaskActionTypes.TaskOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.createTask(payload.task).pipe(
					tap(res => {
						this.store.dispatch(new TaskCreated({ task: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);


	@Effect()
	deleteTask$ = this.actions$
		.pipe(
			ofType<TaskDeleted>(TaskActionTypes.TaskDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.deleteTask(payload.id);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	constructor(private actions$: Actions, private auth: TaskService, private store: Store<AppState>) { }

}
