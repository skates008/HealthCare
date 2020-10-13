import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { TherapyServicesState } from '../_reducers/therapyService.reducers';

import { each } from 'lodash';
import { TherapyService } from '../_models/therapyService.model';
import { query } from '@angular/animations';

export const selectTherapyServicesState = createFeatureSelector<TherapyServicesState>('TherapyService');

export const selectTherapyServiceById = (TherapyServiceId: number) => createSelector(
	selectTherapyServicesState,
	TherapyServicesState => TherapyServicesState.entities[TherapyServiceId]
);


export const selectTherapyServicesPageLoading = createSelector(
	selectTherapyServicesState,
	TherapyServicesState => {
		return TherapyServicesState.listLoading;
	}
);

export const selectTherapyServicesActionLoading = createSelector(
	selectTherapyServicesState,
	TherapyServicesState => TherapyServicesState.actionsLoading
);

export const selectLastCreatedTherapyServiceId = createSelector(
	selectTherapyServicesState,
	TherapyServicesState => TherapyServicesState.lastCreatedTherapyServiceId
);

export const selectTherapyServicesPageLastQuery = createSelector(
	selectTherapyServicesState,
	TherapyServicesState => TherapyServicesState.lastQuery
);

export const selectTherapyServicesInStore = createSelector(
	selectTherapyServicesState,
	TherapyServicesState => {
		const data: TherapyService[] = [];
		each(TherapyServicesState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: TherapyService[] = httpExtension.sortArray(items, TherapyServicesState.lastQuery.sortField, TherapyServicesState.lastQuery.sortOrder);
		return new QueryResultsModel(data, TherapyServicesState.total, '');
	}
);

export const selectTherapyServicesShowInitWaitingMessage = createSelector(
	selectTherapyServicesState,
	TherapyServicesState => TherapyServicesState.showInitWaitingMessage
);

export const selectHasTherapyServicesInStore = createSelector(
	selectTherapyServicesState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);
