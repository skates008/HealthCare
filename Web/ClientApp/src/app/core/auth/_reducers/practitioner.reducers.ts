import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { PractitionerActions, PractitionerActionTypes } from '../_actions/practitioner.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Practitioner } from '../_models/practitioner.model';

export interface PractitionersState extends EntityState<Practitioner> {
	isAllPractitionerLoaded: boolean;
	listLoading: boolean;
	actionsLoading: boolean;
	queryResult: Practitioner[];
	total: number;
	lastCreatedPractitionerId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<Practitioner> = createEntityAdapter<Practitioner>();


export const initialPractitionerState: PractitionersState = adapter.getInitialState({
	isAllPractitionerLoaded: false,
	listLoading: false,
	actionsLoading: false,
	queryResult: [],
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedPractitionerId: undefined,
	showInitWaitingMessage: true
});

export function practitionerReducer(state = initialPractitionerState, action: PractitionerActions): PractitionersState {
	switch (action.type) {
		// case PractitionerActionTypes.PractitionerPageToggleLoading: return {
		// 	...state, listLoading: action.payload.isLoading, lastCreatedParticipantId: undefined
		// };
		// case PractitionerActionTypes.PractitionerActionToggleLoading: return {
		// 	...state, actionsLoading: action.payload.isLoading
		// };
	
		case PractitionerActionTypes.AllPractitionerLoaded:
			 return adapter.addAll(action.payload.practitioner["data"], {
            ...state, isAllPractitionerLoaded: true
		});
		
		case PractitionerActionTypes.PractitionerPageLoaded: {
			return adapter.addMany(action.payload.practitioner, {
				...initialPractitionerState,
				total: action.payload.total,
				queryResult: action.payload.practitioner,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getPractitionerState = createFeatureSelector<PractitionersState>('practitioner');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


