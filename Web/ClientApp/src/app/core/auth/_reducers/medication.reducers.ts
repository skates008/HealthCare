import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { MedicationActions, MedicationActionTypes } from '../_actions/medication.actions';


import { Medication } from '../_models/medication.model';

export interface MedicationsState extends EntityState<Medication> {
    isAllMedicationsLoaded: boolean;
    listLoading: boolean;
    actionsLoading: boolean;
    total: number;
    lastCreatedMedicationId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    queryRowsCount: number;
    queryResult: Medication[];
}

export const adapter: EntityAdapter<Medication> = createEntityAdapter<Medication>();

export const initialMedicationsState: MedicationsState = adapter.getInitialState({
    isAllMedicationsLoaded: false,
    listLoading: false,
    actionsLoading: false,
    total: 0,
    lastQuery: new QueryParamsModel({}),
    lastCreatedMedicationId: undefined,
    showInitWaitingMessage: true,
    queryRowsCount: 0,
    queryResult: [],
});

export function medicationsReducer(state = initialMedicationsState, action: MedicationActions): MedicationsState {
    switch (action.type) {
        case MedicationActionTypes.MedicationPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedMedicationId: undefined
        };
        case MedicationActionTypes.MedicationActionToggleLoading: return {
            ...state, actionsLoading: action.payload.isLoading
        };
        case MedicationActionTypes.MedicationOnServerCreated:
            return {
                ...state,
            };
        case MedicationActionTypes.MedicationCreated:
            return adapter.addOne(action.payload.medication,
                {
                    ...state, lastCreatedMedicationId: action.payload.medication.data.id
                });

        case MedicationActionTypes.MedicationPageLoaded: return adapter.addMany(action.payload.medications, {
            ...initialMedicationsState,
            listLoading: false,
            queryRowsCount: action.payload.total,
            queryResult: action.payload.medications,
            lastQuery: action.payload.page,
            showInitWaitingMessage: false
        });
        case MedicationActionTypes.MedicationDeleted: return adapter.removeOne(action.payload.id, state);


        default: return state;
    }
}

export const getMedicationState = createFeatureSelector<MedicationsState>('medication');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();


