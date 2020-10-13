import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { Invoice } from '../_models/invoice.model';

export enum InvoiceActionTypes {
	AllInvoicesRequested = '[Invoices Module] All Invoices Requested',
	AllInvoicesLoaded = '[Invoices API] All Invoices Loaded',
	InvoiceOnServerCreated = '[Edit Invoice Component] Invoice On Server Created',
	InvoiceCreated = '[Edit Invoice Dialog] Invoice Created',
	InvoiceUpdated = '[Edit Invoice Dialog] Invoice Updated',
	InvoiceDeleted = '[Invoices List Page] Invoice Deleted',
	InvoicesPageRequested = '[Invoices List Page] Invoices Page Requested',
	InvoicesPageLoaded = '[Invoices API] Invoices Page Loaded',
	GenerateInvoice = '[Invoice] Generate Invoice Pdf',
	EmailInvoiceToParticipant = '[Invoice] Send Invoice',
	InvoicesPageCancelled = '[Invoices API] Invoices Page Cancelled',
	InvoicesPageToggleLoading = '[Invoices] Invoices Page Toggle Loading',
	InvoicesActionToggleLoading = '[Invoices] Invoices Action Toggle Loading',
	GetBillingType = '[Invoices] Action Invoice Drodown',
	InvoiceUpdatedResponse = '[Invoices] Invoice Updated Response',
	GetBillingTypeLoaded = '[Careplan Component] Load Billing Type'
}

export class InvoiceOnServerCreated implements Action {
	readonly type = InvoiceActionTypes.InvoiceOnServerCreated;
	constructor(public payload: { invoice: Invoice }) { }
}

export class InvoiceCreated implements Action {
	readonly type = InvoiceActionTypes.InvoiceCreated;
	constructor(public payload: { invoice: any }) { }
}

export class InvoiceUpdated implements Action {
	readonly type = InvoiceActionTypes.InvoiceUpdated;
	constructor(public payload: {
		partialInvoice: Update<Invoice>,
		invoice: Invoice
	}) { }
}

export class InvoiceUpdatedResponse implements Action {
	readonly type = InvoiceActionTypes.InvoiceUpdatedResponse;
	constructor(public payload: { invoice: any }) { }
}


export class InvoiceDeleted implements Action {
	readonly type = InvoiceActionTypes.InvoiceDeleted;
	constructor(public payload: { id: any }) { }
}

export class InvoicesPageRequested implements Action {
	readonly type = InvoiceActionTypes.InvoicesPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class InvoicesPageLoaded implements Action {
	readonly type = InvoiceActionTypes.InvoicesPageLoaded;
	constructor(public payload: {
		invoices: Invoice[],
		total: number,
		page: QueryParamsModel
	}) {
	 }
}

export class InvoicesPageCancelled implements Action {
	readonly type = InvoiceActionTypes.InvoicesPageCancelled;
}

export class InvoicesPageToggleLoading implements Action {
	readonly type = InvoiceActionTypes.InvoicesPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GenerateInvoice implements Action {
	readonly type = InvoiceActionTypes.GenerateInvoice;
	constructor(public payload: { invoice: any }) { }
}

export class EmailInvoiceToParticipant implements Action {
	readonly type = InvoiceActionTypes.EmailInvoiceToParticipant;
	constructor(public payload: { invoice: any }) { }
}

export class GetBillingType implements Action {
	readonly type = InvoiceActionTypes.GetBillingType;
	constructor(public payload: {}) { }
}

export class GetBillingTypeLoaded implements Action {
    readonly type = InvoiceActionTypes.GetBillingTypeLoaded;
    constructor(public payload: {
        billing: any
    }) { }
}

export class InvoicesActionToggleLoading implements Action {
	readonly type = InvoiceActionTypes.InvoicesActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export type InvoiceActions = InvoiceCreated
	| InvoiceUpdated
	| InvoiceDeleted
	| InvoiceOnServerCreated
	| InvoicesPageLoaded
	| GenerateInvoice
	| EmailInvoiceToParticipant
	| InvoicesPageCancelled
	| InvoicesPageToggleLoading
	| InvoicesPageRequested
	| InvoiceUpdatedResponse
	| GetBillingType
	| GetBillingTypeLoaded
	| InvoicesActionToggleLoading;
