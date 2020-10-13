import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { AllergyActions, AllergyActionTypes } from '../_actions/allergy.actions';


import { Allergy } from '../_models/allergy.model';

export interface AllergiesState extends EntityState<Allergy> {
    isAllAllergiesLoaded: boolean;
    listLoading: boolean;
    actionsLoading: boolean;
    total: number;
    lastCreatedAllergyId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    queryRowsCount: number;
    queryResult: Allergy[];
}

export const adapter: EntityAdapter<Allergy> = createEntityAdapter<Allergy>();

export const initialAllergiesState: AllergiesState = adapter.getInitialState({
    isAllAllergiesLoaded: false,
    listLoading: false,
    actionsLoading: false,
    total: 0,
    lastQuery: new QueryParamsModel({}),
    lastCreatedAllergyId: undefined,
    showInitWaitingMessage: true,
    queryRowsCount: 0,
    queryResult: [],
});

export function allergiesReducer(state = initialAllergiesState, action: AllergyActions): AllergiesState {
    switch (action.type) {
        case AllergyActionTypes.AllergyPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedAllergyId: undefined
        };
        case AllergyActionTypes.AllergyActionToggleLoading: return {
            ...state, actionsLoading: action.payload.isLoading
        };
        case AllergyActionTypes.AllergyPageLoaded: return adapter.addMany(action.payload.allergies,
            {
                ...initialAllergiesState,
                listLoading: false,
                queryRowsCount: action.payload.total,
                queryResult: action.payload.allergies,
                lastQuery: action.payload.page,
                showInitWaitingMessage: false,
            });
        case AllergyActionTypes.AllergyDeleted: return adapter.removeOne(action.payload.id, state);
        case AllergyActionTypes.AllergyOnServerCreated:
            return {
                ...state,
            };
        case AllergyActionTypes.AllergyCreated:
            return adapter.addOne(action.payload.allergy,
                {
                    ...state, lastCreatedAllergyId: action.payload.allergy.data.id
                });

        default: return state;
    }
}

export const getAllergyState = createFeatureSelector<AllergiesState>('allergy');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();


