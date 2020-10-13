import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { InvoicesState } from '../_reducers/invoice.reducers';

import { each } from 'lodash';
import { Invoice } from '../_models/invoice.model';

export const selectInvoicesState = createFeatureSelector<InvoicesState>('Invoice');

export const selectInvoiceById = (InvoiceId: number) => createSelector(
	selectInvoicesState,
	InvoicesState => InvoicesState.entities[InvoiceId]
);


export const selectInvoicesPageLoading = createSelector(
	selectInvoicesState,
	InvoicesState => {
		return InvoicesState.listLoading;
	}
);

export const selectInvoicesActionLoading = createSelector(
	selectInvoicesState,
	InvoicesState => InvoicesState.actionsLoading
);

export const selectLastCreatedInvoiceId = createSelector(
	selectInvoicesState,
	InvoicesState => InvoicesState.lastCreatedInvoiceId
);

export const selectInvoiceCreatedSuccess = createSelector(
	selectInvoicesState,
	InvoicesState => InvoicesState.success
);

export const selectInvoicesPageLastQuery = createSelector(
	selectInvoicesState,
	InvoicesState => InvoicesState.lastQuery
);

export const selectBillingType = createSelector(
    selectInvoicesState,
    InvoicesState =>
	InvoicesState.getBillingType
);

export const selectInvoicesInStore = createSelector(
	selectInvoicesState,
	InvoicesState => {
		const data: Invoice[] = [];
		each(InvoicesState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// // const result: Invoice[] = httpExtension.sortArray(items, InvoicesState.lastQuery.sortField, InvoicesState.lastQuery.sortOrder);
		// const result: Invoice[] = httpExtension.sortArray(items, InvoicesState.lastQuery.sortField, InvoicesState.lastQuery.sortOrder);
		return new QueryResultsModel(data, InvoicesState.total, '');
	}
);

export const selectInvoicesShowInitWaitingMessage = createSelector(
	selectInvoicesState,
	InvoicesState => InvoicesState.showInitWaitingMessage
);

export const selectHasInvoicesInStore = createSelector(
	selectInvoicesState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);
