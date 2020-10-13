import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { BillableItemActions, BillableItemActionTypes } from '../_actions/billableItem.actions';

import { QueryParamsModel } from '../../_base/crud';

import { BillableItem } from '../_models/billableItem.model';

export interface BillableItemsState extends EntityState<BillableItem> {
	listLoading: boolean;
	actionsLoading: boolean;
	queryRowsCount: number;
	total: number;
	lastCreatedBillableItemId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	billableItems: any;
}

export const adapter: EntityAdapter<BillableItem> = createEntityAdapter<BillableItem>();

export const initialBillableItemsState: BillableItemsState = adapter.getInitialState({
	listLoading: false,
	actionsLoading: false,
	queryRowsCount: 0,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedBillableItemId: undefined,
	showInitWaitingMessage: true,
	billableItems: undefined
});

export function billableItemsReducer(state = initialBillableItemsState, action: BillableItemActions): BillableItemsState {
	switch (action.type) {
		case BillableItemActionTypes.BillableItemsPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedBillableItemId: undefined
		};
		case BillableItemActionTypes.BillableItemsActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case BillableItemActionTypes.BillableItemOnServerCreated: return {
			...state,
			lastCreatedBillableItemId: action.payload.billableItem.id
		};
		case BillableItemActionTypes.BillableItemsUpdatedResponse: return adapter.addOne(action.payload.billableItem, {
			...state,
			lastCreatedBillableItemId: action.payload.billableItem.id
		});
		case BillableItemActionTypes.BillableItemCreated: return adapter.addOne(action.payload.billableItem, {
			...state,
			lastCreatedBillableItemId: action.payload.billableItem.id
		});
		case BillableItemActionTypes.BillableItemUpdated: return adapter.updateOne(action.payload.partialBillableItem, state);
		case BillableItemActionTypes.BillableItemDeleted: return adapter.removeOne(action.payload.id, state);
		case BillableItemActionTypes.BillableItemsPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case BillableItemActionTypes.BillableItemsPageLoaded: {
			return adapter.addMany(action.payload.billableItems, {
				...initialBillableItemsState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}

		case BillableItemActionTypes.GetBillableItemLoadedById: {
			return adapter.addOne(action.payload.billableItems, {
				...initialBillableItemsState,
				total: action.payload.total,
				queryRowsCount: action.payload.total,
				listLoading: false,
				showInitWaitingMessage: false,
			});
		}

		case BillableItemActionTypes.BillableItemsForTimeLoadedLoaded: {
			return adapter.addMany(action.payload.billableTimeEntries, {
				...initialBillableItemsState,
				total: action.payload.total,
			});
		}

		default: return state;
	}
}

export const getUserState = createFeatureSelector<BillableItemsState>('billableItem');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


