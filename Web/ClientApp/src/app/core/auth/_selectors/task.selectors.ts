import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { TasksState } from '../_reducers/task.reducers';

import { each } from 'lodash';
import { Task } from '../_models/task.model';
import { query } from '@angular/animations';

export const selectTasksState = createFeatureSelector<TasksState>('Task');

export const selectTaskById = (TaskId: number) => createSelector(
	selectTasksState,
	TasksState => TasksState.entities[TaskId]
);


export const selectTasksPageLoading = createSelector(
	selectTasksState,
	TasksState => {
		return TasksState.listLoading;
	}
);

export const selectTasksActionLoading = createSelector(
	selectTasksState,
	TasksState => TasksState.actionsLoading
);

export const selectLastCreatedTaskId = createSelector(
	selectTasksState,
	TasksState => TasksState.lastCreatedTaskId
);

export const selectTaskCreatedSuccess = createSelector(
	selectTasksState,
	TasksState => TasksState.success
);

export const selectTasksPageLastQuery = createSelector(
	selectTasksState,
	TasksState => TasksState.lastQuery
);

export const selectTasksInStore = createSelector(
	selectTasksState,
	TasksState => {
		const data: Task[] = [];
		each(TasksState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Task[] = httpExtension.sortArray(items, TasksState.lastQuery.sortField, TasksState.lastQuery.sortOrder);
		return new QueryResultsModel(data, TasksState.total, '');
	}
);

export const selectTasksShowInitWaitingMessage = createSelector(
	selectTasksState,
	TasksState => TasksState.showInitWaitingMessage
);

export const selectHasTasksInStore = createSelector(
	selectTasksState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);
