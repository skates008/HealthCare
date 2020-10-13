import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { SettingState } from '../_reducers/setting.reducers';

import { each } from 'lodash';
import { Setting } from '../_models/settings.model';
import { query } from '@angular/animations';

export const selectSettingState = createFeatureSelector<SettingState>('setting');


export const selectQueryResultSetting = createSelector(
    selectSettingState,
    SettingState => {
        const data: Setting[] = [];
        each(SettingState.entities, element => {
            data.push(element);
        });
        // const httpExtension = new HttpExtenstionsModel();
        // const result: Setting[] = httpExtension.sortArray(items, SettingState.lastQuery.sortField, SettingState.lastQuery.sortOrder);
        return new QueryResultsModel(SettingState.queryResult, SettingState.queryRowsCount);
    }
);



