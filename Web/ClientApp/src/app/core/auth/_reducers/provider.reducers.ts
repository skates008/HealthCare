import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ProviderActions, ProviderActionTypes } from '../_actions/provider.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Provider } from '../_models/provider.model';

export interface ProvidersState extends EntityState<Provider> {
	// isAllParticipantsLoaded: boolean;
	listLoading: boolean;
	actionsLoading: boolean;
	queryResult: any;
	total: number;
	lastCreatedProviderId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<Provider> = createEntityAdapter<Provider>();


export const initialProviderState: ProvidersState = adapter.getInitialState({
	// isAllParticipantsLoaded: false,
	listLoading: false,
	actionsLoading: false,
	queryResult: [],
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedProviderId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function providersReducer(state = initialProviderState, action: ProviderActions): ProvidersState {
	switch (action.type) {
		case ProviderActionTypes.ProviderPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedProviderId: undefined
		};
		case ProviderActionTypes.ProviderActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
        };
        
        case ProviderActionTypes.ProviderRegistrationComplete:
        return adapter.addOne(action.payload.provider, {
			...state,  lastCreatedProviderId: action.payload.provider.id,
			success: action.payload.success
		});

		// case ParticipantActionTypes.ParticipantCreated: return adapter.addOne(action.payload.participant, {
		// 	...state, lastCreatedParticipantId: action.payload.participant.data.id
		// });

		default: return state;
	}
}

export const getUserState = createFeatureSelector<ProvidersState>('provider');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


