import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { TherapyServiceActions, TherapyServiceActionTypes } from '../_actions/therapyService.actions';

import { QueryParamsModel } from '../../_base/crud';

import { TherapyService } from '../_models/therapyService.model';

export interface TherapyServicesState extends EntityState<TherapyService> {
	listLoading: boolean;
	actionsLoading: boolean;
	queryRowsCount: number;
	total: number;
	lastCreatedTherapyServiceId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<TherapyService> = createEntityAdapter<TherapyService>();

export const initialTherapyServicesState: TherapyServicesState = adapter.getInitialState({
	listLoading: false,
	actionsLoading: false,
	queryRowsCount: 0,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedTherapyServiceId: undefined,
	showInitWaitingMessage: true
});

export function therapyServicesReducer(state = initialTherapyServicesState, action: TherapyServiceActions): TherapyServicesState {
	switch (action.type) {
		case TherapyServiceActionTypes.TherapyServicesPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedTherapyServiceId: undefined
		};
		case TherapyServiceActionTypes.TherapyServicesActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case TherapyServiceActionTypes.TherapyServiceOnServerCreated: return {
			...state
		};
		case TherapyServiceActionTypes.TherapyServiceCreated: return adapter.addOne(action.payload.therapyService, {
			...state, 
			lastCreatedTherapyServiceId: action.payload.therapyService.id
		});
		case TherapyServiceActionTypes.TherapyServiceUpdated: return adapter.updateOne(action.payload.partialTherapyService, state);
		case TherapyServiceActionTypes.TherapyServiceDeleted: return adapter.removeOne(action.payload.id, state);
		case TherapyServiceActionTypes.TherapyServicesPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case TherapyServiceActionTypes.TherapyServicesPageLoaded: {
			return adapter.addMany(action.payload.therapyServices, {
				...initialTherapyServicesState,
				total: action.payload.total,
				queryRowsCount: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		};

		default: return state;
	}
}

export const getUserState = createFeatureSelector<TherapyServicesState>('therapyService');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


