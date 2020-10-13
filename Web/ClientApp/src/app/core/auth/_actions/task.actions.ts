import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { Task } from '../_models/task.model';

export enum TaskActionTypes {
	AllTasksRequested = '[Tasks Module] All Tasks Requested',
	AllTasksLoaded = '[Tasks API] All Tasks Loaded',
	TaskOnServerCreated = '[Edit Task Component] Task On Server Created',
	TaskCreated = '[Edit Task Dialog] Task Created',
	TaskUpdated = '[Edit Task Dialog] Task Updated',
	TaskDeleted = '[Tasks List Page] Task Deleted',
	TasksPageRequested = '[Tasks List Page] Tasks Page Requested',
	TasksPageLoaded = '[Tasks API] Tasks Page Loaded',
	TasksPageCancelled = '[Tasks API] Tasks Page Cancelled',
	TasksPageToggleLoading = '[Tasks] Tasks Page Toggle Loading',
	TasksActionToggleLoading = '[Tasks] Tasks Action Toggle Loading',
	TaskUpdatedResponse = '[Tasks] Task Updated Response'
}

export class TaskOnServerCreated implements Action {
	readonly type = TaskActionTypes.TaskOnServerCreated;
	constructor(public payload: { task: Task }) { }
}

export class TaskCreated implements Action {
	readonly type = TaskActionTypes.TaskCreated;
	constructor(public payload: { task: any }) { }
}

export class TaskUpdated implements Action {
	readonly type = TaskActionTypes.TaskUpdated;
	constructor(public payload: {
		partialTask: Update<Task>,
		task: Task
	}) { }
}

export class TaskUpdatedResponse implements Action {
	readonly type = TaskActionTypes.TaskUpdatedResponse;
	constructor(public payload: { task: any }) { }
}


export class TaskDeleted implements Action {
	readonly type = TaskActionTypes.TaskDeleted;
	constructor(public payload: { id: any }) { }
}

export class TasksPageRequested implements Action {
	readonly type = TaskActionTypes.TasksPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class TasksPageLoaded implements Action {
	readonly type = TaskActionTypes.TasksPageLoaded;
	constructor(public payload: { tasks: Task[], total: number, page: QueryParamsModel }) {
	 }
}

export class TasksPageCancelled implements Action {
	readonly type = TaskActionTypes.TasksPageCancelled;
}

export class TasksPageToggleLoading implements Action {
	readonly type = TaskActionTypes.TasksPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class TasksActionToggleLoading implements Action {
	readonly type = TaskActionTypes.TasksActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export type TaskActions = TaskCreated
	| TaskUpdated
	| TaskDeleted
	| TaskOnServerCreated
	| TasksPageLoaded
	| TasksPageCancelled
	| TasksPageToggleLoading
	| TasksPageRequested
	| TaskUpdatedResponse
	| TasksActionToggleLoading;
