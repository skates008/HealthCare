import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { TaskActions, TaskActionTypes } from '../_actions/task.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Task } from '../_models/task.model';

export interface TasksState extends EntityState<Task> {
	listLoading: boolean;
	actionsLoading: boolean;
	queryRowsCount: number;
	total: number;
	lastCreatedTaskId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export const initialTasksState: TasksState = adapter.getInitialState({
	listLoading: false,
	actionsLoading: false,
	queryRowsCount: 0,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedTaskId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function tasksReducer(state = initialTasksState, action: TaskActions): TasksState {
	switch (action.type) {
		case TaskActionTypes.TasksPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedTaskId: undefined
		};
		case TaskActionTypes.TasksActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case TaskActionTypes.TaskOnServerCreated: return {
			...state
		};
		case TaskActionTypes.TaskCreated: return adapter.addOne(action.payload.task, {
			...state, 
			success: action.payload.task.success
		});
		case TaskActionTypes.TaskUpdated: return adapter.updateOne(action.payload.partialTask, state);
		case TaskActionTypes.TaskUpdatedResponse:return adapter.addOne(action.payload.task, {
			...state, 
			success: action.payload.task.success
		});
		case TaskActionTypes.TaskDeleted: return adapter.removeOne(action.payload.id, state);
		case TaskActionTypes.TasksPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case TaskActionTypes.TasksPageLoaded: {
			return adapter.addMany(action.payload.tasks, {
				...initialTasksState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		};

		default: return state;
	}
}

export const getUserState = createFeatureSelector<TasksState>('task');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


