import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { SettingActions, SettingActionTypes } from '../_actions/setting.actions';


import { Setting } from '../_models/settings.model';

export interface SettingState extends EntityState<Setting> {
    isAllSettingsLoaded: boolean;
    listLoading: boolean;
    actionsLoading: boolean;
    total: number;
    lastCreatedSettingId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    queryRowsCount: number;
    queryResult: Setting[];
}

export const adapter: EntityAdapter<Setting> = createEntityAdapter<Setting>();

export const initialSettingState: SettingState = adapter.getInitialState({
    isAllSettingsLoaded: false,
    listLoading: false,
    actionsLoading: false,
    total: 0,
    lastQuery: new QueryParamsModel({}),
    lastCreatedSettingId: undefined,
    showInitWaitingMessage: true,
    queryRowsCount: 0,
    queryResult: [],
});

export function settingsReducer(state = initialSettingState, action: SettingActions): SettingState {
    switch (action.type) {
        case SettingActionTypes.SettingPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedSettingId: undefined
        };
        case SettingActionTypes.SettingActionToggleLoading: return {
            ...state, actionsLoading: action.payload.isLoading
        };
        case SettingActionTypes.SettingPageLoaded: return adapter.addMany(action.payload.settings,
            {
                ...initialSettingState,
                listLoading: false,
                queryRowsCount: action.payload.total,
                queryResult: action.payload.settings,
                lastQuery: action.payload.page,
                showInitWaitingMessage: false,
            });
        case SettingActionTypes.SettingDeleted: return adapter.removeOne(action.payload.id, state);
        case SettingActionTypes.SettingOnServerCreated:
            return {
                ...state,
            };
        case SettingActionTypes.SettingUpdated: return adapter.updateOne(action.payload.partialSetting, state);
        case SettingActionTypes.SettingCreated:
            return adapter.addOne(action.payload.setting,
                {
                    ...state, lastCreatedSettingId: action.payload.setting.id
                });

        default: return state;
    }
}

export const getSettingState = createFeatureSelector<SettingState>('Setting');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();


