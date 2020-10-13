// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AgreementState } from '../_reducers/agreement.reducers';
import { each } from 'lodash';
import { Agreement } from '../_models/agreement.model';


export const selectAgreementState = createFeatureSelector<AgreementState>('agreement');

export const selectAgreementById = (agreementId: number) => createSelector(
	selectAgreementState,
	agreementState => agreementState.entities[agreementId]
);

export const selectAgreementPageLoading = createSelector(
	selectAgreementState,
	agreementState => {
		return agreementState.listLoading;
	}
);

export const selectAgreementActionLoading = createSelector(
	selectAgreementState,
	agreementState => agreementState.actionsloading
);

export const selectLastCreatedAgreementId = createSelector(
	selectAgreementState,
	agreementState => agreementState.lastCreatedAgreementId
);

export const selectAgreementIsSuccess = createSelector(
	selectAgreementState,
	agreementState => agreementState.success
);
export const selectAgreementPageLastQuery = createSelector(
	selectAgreementState,
	agreementState => agreementState.lastQuery
);

export const selectAgreementInStore = createSelector(
	selectAgreementState,
	agreementState => {
		const data: Agreement[] = [];
		each(agreementState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Agreement[] = httpExtension.sortArray(items, agreementState.lastQuery.sortField, agreementState.lastQuery.sortOrder);
		return new QueryResultsModel(data, agreementState.total, '');
	}
);

export const selectAgreementShowInitWaitingMessage = createSelector(
	selectAgreementState,
	agreementState => agreementState.showInitWaitingMessage
);

export const selectHasAgreementInStore = createSelector(
	selectAgreementState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}

		return true;
	}
);
