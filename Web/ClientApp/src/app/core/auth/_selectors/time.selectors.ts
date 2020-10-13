import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { TimesState } from '../_reducers/time.reducers';

import { each } from 'lodash';
import { Time } from '../_models/time.model';
import { query } from '@angular/animations';

export const selectTimesState = createFeatureSelector<TimesState>('Time');

export const selectTimeById = (TimeId: number) => createSelector(
	selectTimesState,
	TimesState => TimesState.entities[TimeId]
);

export const selectTimesPageLoading = createSelector(
	selectTimesState,
	TimesState => {
		return TimesState.listLoading;
	}
);

export const selectTimesActionLoading = createSelector(
	selectTimesState,
	TimesState => TimesState.actionsLoading
);

export const selectLastCreatedTimeId = createSelector(
	selectTimesState,
	TimesState => TimesState.lastCreatedTimeId
);

export const selectTimesPageLastQuery = createSelector(
	selectTimesState,
	TimesState => TimesState.lastQuery
);

export const selectTimesInStore = createSelector(
	selectTimesState,
	TimesState => {
		const data: Time[] = [];
		each(TimesState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Time[] = httpExtension.sortArray(items, TimesState.lastQuery.sortField, TimesState.lastQuery.sortOrder);
		return new QueryResultsModel(data, TimesState.total, '');
	}
);

export const selectTimesShowInitWaitingMessage = createSelector(
	selectTimesState,
	TimesState => TimesState.showInitWaitingMessage
);

export const selectHasTimesInStore = createSelector(
	selectTimesState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);

export const selectTimeCreateSuccess = createSelector(
	selectTimesState,
	selectTimesState => selectTimesState.success
);


