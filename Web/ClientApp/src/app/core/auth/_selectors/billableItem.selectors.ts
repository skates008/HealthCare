import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { BillableItemsState } from '../_reducers/billableItem.reducers';

import { each } from 'lodash';
import { BillableItem } from '../_models/billableItem.model';
import { query } from '@angular/animations';

export const selectBillableItemsState = createFeatureSelector<BillableItemsState>('BillableItem');

export const selectBillableItemById = (BillableItemId: number) => createSelector(
	selectBillableItemsState,
	BillableItemsState => BillableItemsState.entities[BillableItemId]
);


export const selectBillableItemsPageLoading = createSelector(
	selectBillableItemsState,
	BillableItemsState => {
		return BillableItemsState.listLoading;
	}
);

export const selectBillableItemsActionLoading = createSelector(
	selectBillableItemsState,
	BillableItemsState => BillableItemsState.actionsLoading
);

export const selectLastCreatedBillableItemId = createSelector(
	selectBillableItemsState,
	BillableItemsState => BillableItemsState.lastCreatedBillableItemId
);

export const selectBillableItemsPageLastQuery = createSelector(
	selectBillableItemsState,
	BillableItemsState => BillableItemsState.lastQuery
);

export const selectBillableItemsInStore = createSelector(
	selectBillableItemsState,
	BillableItemsState => {
		const items: BillableItem[] = [];
		each(BillableItemsState.entities, element => {
			items.push(element);
		});
		const httpExtension = new HttpExtenstionsModel();
		const result: BillableItem[] = httpExtension.sortArray(items, BillableItemsState.lastQuery.sortField, BillableItemsState.lastQuery.sortOrder);
		return new QueryResultsModel(result, BillableItemsState.total, '');
	}
);

export const selectBillableItemsShowInitWaitingMessage = createSelector(
	selectBillableItemsState,
	BillableItemsState => BillableItemsState.showInitWaitingMessage
);

export const selectHasBillableItemsInStore = createSelector(
	selectBillableItemsState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);

export const selectBillableTimeEntries = createSelector(
	selectBillableItemsState,
	BillableItemsState => {
		const items = BillableItemsState.entities;
		return items;
	}
);

// export const selectBillableItems = createSelector(
// 	selectBillableItemsState,
// 	TimesState => selectBillableItemsState.billableItems
// );
