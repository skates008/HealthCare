import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { CareplansState } from '../_reducers/careplan.reducers';

import { each } from 'lodash';
import { Careplan } from '../_models/careplan.model';
import { query } from '@angular/animations';

export const selectCareplansState = createFeatureSelector<CareplansState>('Careplan');

export const selectCareplanById = (CareplanId: any) => createSelector(
	selectCareplansState,
	CareplansState => CareplansState.entities[CareplanId]
);


export const selectCareplansPageLoading = createSelector(
	selectCareplansState,
	CareplansState => {
		return CareplansState.listLoading;
	}
);

export const selectCareplansActionLoading = createSelector(
	selectCareplansState,
	CareplansState => CareplansState.actionsLoading
);

export const selectLastCreatedCareplanId = createSelector(
	selectCareplansState,
	CareplansState => CareplansState.lastCreatedCareplanId,
);

export const selectIsCareplanCreateSuccess = createSelector(
	selectCareplansState,
	CareplansState => CareplansState.success,
);

export const selectCareplansPageLastQuery = createSelector(
	selectCareplansState,
	CareplansState => CareplansState.lastQuery
);

export const selectCareplansInStore = createSelector(
	selectCareplansState,
	CareplansState => {
		const data: Careplan[] = [];
		each(CareplansState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Careplan[] = httpExtension.sortArray(items, CareplansState.lastQuery.sortField, CareplansState.lastQuery.sortOrder);
		return new QueryResultsModel(data, CareplansState.total, '');
	}
);

export const selectCareplansShowInitWaitingMessage = createSelector(
	selectCareplansState,
	CareplansState => CareplansState.showInitWaitingMessage
);

export const selectHasCareplansInStore = createSelector(
	selectCareplansState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);

	export const selectCarePlanDetails = createSelector(
		selectCareplansState,
		CareplansState => CareplansState.getCareplanDetails
	);

	export const selectEditPageList = createSelector(
		selectCareplansState,
		CareplansState => CareplansState.getEditPageList
	);
	

