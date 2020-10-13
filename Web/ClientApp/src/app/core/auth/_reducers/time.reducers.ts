import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { TimeActions, TimeActionTypes } from '../_actions/time.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Time } from '../_models/time.model';

export interface TimesState extends EntityState<Time> {
	listLoading: boolean;
	actionsLoading: boolean;
	queryRowsCount: number;
	total: number;
	lastCreatedTimeId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	billableItems: any;
	success: boolean;

}

export const adapter: EntityAdapter<Time> = createEntityAdapter<Time>();

export const initialTimesState: TimesState = adapter.getInitialState({
	listLoading: false,
	actionsLoading: false,
	queryRowsCount: 0,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedTimeId: undefined,
	showInitWaitingMessage: true,
	billableItems: undefined,
	success: false
});

export function timesReducer(state = initialTimesState, action: TimeActions): TimesState {
	switch (action.type) {
		case TimeActionTypes.TimesPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedTimeId: undefined
		};
		case TimeActionTypes.TimesActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case TimeActionTypes.TimeOnServerCreated: return {
			...state
		};
		case TimeActionTypes.TimeCreated: return adapter.addOne(action.payload.time, {
			...state, 
			lastCreatedTimeId: action.payload.time.id,
			success:action.payload.success
		});
		case TimeActionTypes.TimeUpdatedLoaded: return adapter.addOne(action.payload.time, {
			...state, 
			lastCreatedTimeId: action.payload.time.id,
			success:action.payload.success
		});
		case TimeActionTypes.TimeUpdated: return adapter.updateOne(action.payload.partialTime, state);
		case TimeActionTypes.TimeDeleted: return adapter.removeOne(action.payload.id, state);
		case TimeActionTypes.TimesPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case TimeActionTypes.TimesPageLoaded: {
			return adapter.addMany(action.payload.times, {
				...initialTimesState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		};

	

		case TimeActionTypes.TimeEntryDetailsByIdLoaded: {
			return adapter.addOne(action.payload.times, {
				...initialTimesState,
				total: action.payload.total,
				success: action.payload.success,
				listLoading: false,
				showInitWaitingMessage: false,
				lastQuery: action.payload.times,
			});
		};

			case TimeActionTypes.StatementPageLoaded: {
				return adapter.addMany(action.payload.times, {
					...initialTimesState,
					total: action.payload.total,
					success: action.payload.success,
					listLoading: false,
					showInitWaitingMessage: false,
					// lastQuery: action.payload.times,
				});
		};

		case TimeActionTypes.StatementViewPageLoaded: {
			return adapter.addOne(action.payload.times, {
				...initialTimesState,
				total: action.payload.total,
				success: action.payload.success,
				listLoading: false,
				showInitWaitingMessage: false,
				lastQuery: action.payload.times,
			});
	};

		default: return state;
	}
}

export const getUserState = createFeatureSelector<TimesState>('time');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


