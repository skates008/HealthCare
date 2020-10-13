import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { InvoiceActions, InvoiceActionTypes } from '../_actions/invoice.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Invoice } from '../_models/invoice.model';

export interface InvoicesState extends EntityState<Invoice> {
	listLoading: boolean;
	actionsLoading: boolean;
	queryRowsCount: number;
	total: number;
	lastCreatedInvoiceId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
	getBillingType: any;
}

export const adapter: EntityAdapter<Invoice> = createEntityAdapter<Invoice>();

export const initialInvoicesState: InvoicesState = adapter.getInitialState({
	listLoading: false,
	actionsLoading: false,
	queryRowsCount: 0,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedInvoiceId: undefined,
	showInitWaitingMessage: true,
	success: false,
	getBillingType: undefined
});

export function invoicesReducer(state = initialInvoicesState, action: InvoiceActions): InvoicesState {
	switch (action.type) {
		case InvoiceActionTypes.InvoicesPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedInvoiceId: undefined
		};
		case InvoiceActionTypes.InvoicesActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case InvoiceActionTypes.InvoiceOnServerCreated: return {
			...state
		};
		case InvoiceActionTypes.InvoiceCreated: return adapter.addOne(action.payload.invoice, {
			...state, 
			success: action.payload.invoice.success
		});
		case InvoiceActionTypes.InvoiceUpdated: return adapter.updateOne(action.payload.partialInvoice, state);
		case InvoiceActionTypes.InvoiceUpdatedResponse: return adapter.addOne(action.payload.invoice, {
			...state,
			success: action.payload.invoice.success
		});
		case InvoiceActionTypes.InvoiceDeleted: return adapter.removeOne(action.payload.id, state);
		case InvoiceActionTypes.InvoicesPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case InvoiceActionTypes.InvoicesPageLoaded: {
			return adapter.addMany(action.payload.invoices, {
				...initialInvoicesState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		};

		case InvoiceActionTypes.GetBillingTypeLoaded: return adapter.addOne(action.payload.billing, {
				...state,
				getBillingType : action.payload.billing
			});

		default: return state;
	}
}

export const getUserState = createFeatureSelector<InvoicesState>('invoice');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


