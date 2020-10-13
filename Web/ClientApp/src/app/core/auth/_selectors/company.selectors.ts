import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { CompanysState } from '../_reducers/company.reducers';

import { each } from 'lodash';
import { Company } from '../_models/company.model';
import * as fromCompany from '../_reducers/company.reducers';
import { query } from '@angular/animations';

export const selectCompanysState = createFeatureSelector<CompanysState>('company');

export const selectCompanyById = (companyId) => createSelector(
	selectCompanysState,
	companysState => companysState.entities[companyId]
);


export const selectCompanysPageLoading = createSelector(
	selectCompanysState,
	companysState => {
		return companysState.listLoading;
	}
);

export const allCompanysLoaded = createSelector(
	selectCompanysState,
	companysState => companysState.isAllCompanysLoaded
);

export const selectAllCompanys = createSelector(
	selectCompanysState,
	fromCompany.selectAll
);

export const selectCompanysActionLoading = createSelector(
	selectCompanysState,
	companysState => companysState.actionsLoading
);

export const selectLastCreatedCompanyId = createSelector(
	selectCompanysState,
	companysState => companysState.lastCreatedCompanyId
);

export const selectIsSuccess = createSelector(
	selectCompanysState,
	companysState => companysState.success
);

export const getCompanyByIDSuccess = createSelector(
	selectCompanysState,
	companysState => companysState.success
);



export const selectgetPatientById = createSelector(
	selectCompanysState,
	companysState => companysState.getPatientById
);

export const selectInitRegistration = createSelector(
	selectCompanysState,
	companysState => companysState.initRegistration
);

export const selectRegistrationComplete = createSelector(
	selectCompanysState,
	companysState => companysState.registrationCompleteData
);

// export const isRegistrationSuccess = createSelector(
// 	selectCompanysState,
// 	companysState => companysState.success
// );




export const selectCompanysPageLastQuery = createSelector(
	selectCompanysState,
	companysState => companysState.lastQuery
);

export const selectCompanysInStore = createSelector(
	selectCompanysState,
	companysState => {
		const data: Company[] = [];
		each(companysState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Company[] = httpExtension.sortArray(data, companysState.lastQuery.sortField, companysState.lastQuery.sortOrder);
		return new QueryResultsModel(data, companysState.total, '');
	}
);

export const selectCompanysShowInitWaitingMessage = createSelector(
	selectCompanysState,
	companysState => companysState.showInitWaitingMessage
);

export const selectHasCompanysInStore = createSelector(
	selectCompanysState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);

