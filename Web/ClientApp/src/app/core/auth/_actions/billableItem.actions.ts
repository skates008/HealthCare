import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { BillableItem } from '../_models/billableItem.model';

export enum BillableItemActionTypes {
	AllBillableItemsRequested = '[BillableItems Module] All BillableItems Requested',
	AllBillableItemsLoaded = '[BillableItems API] All BillableItems Loaded',
	BillableItemOnServerCreated = '[Edit BillableItem Component] BillableItem On Server Created',
	BillableItemCreated = '[Edit BillableItem Dialog] BillableItem Created',
	BillableItemUpdated = '[Edit BillableItem Dialog] BillableItem Updated',
	BillableItemDeleted = '[BillableItems List Page] BillableItem Deleted',
	BillableItemsPageRequested = '[BillableItems List Page] BillableItems Page Requested',
	BillableItemsPageLoaded = '[BillableItems API] BillableItems Page Loaded',
	BillableItemsPageCancelled = '[BillableItems API] BillableItems Page Cancelled',
	BillableItemsPageToggleLoading = '[BillableItems] BillableItems Page Toggle Loading',
	BillableItemsActionToggleLoading = '[BillableItems] BillableItems Action Toggle Loading',
	GetBillableItemById = '[Billable Edit Component] Get Billable Item By ID',
	GetBillableItemLoadedById = '[Billable Edit Component] Get Billable Item By ID Loaded',
	BillableItemsUpdatedResponse = '[BillableItem Update Response] Billable Item Udated Response',
	BillableItemsForTimeRequested ='[Billable Item] Billable Items Requested',
	BillableItemsForTimeLoadedLoaded ='[Billable Item Loaded] Billable Items Loaded',
}

export class BillableItemOnServerCreated implements Action {
	readonly type = BillableItemActionTypes.BillableItemOnServerCreated;
	constructor(public payload: { billableItem: BillableItem }) { }
}

export class BillableItemCreated implements Action {
	readonly type = BillableItemActionTypes.BillableItemCreated;
	constructor(public payload: { billableItem: BillableItem }) { }
}


export class BillableItemUpdated implements Action {
	readonly type = BillableItemActionTypes.BillableItemUpdated;
	constructor(public payload: {
		partialBillableItem: Update<BillableItem>,
		billableItem: BillableItem
	}) { }
}

export class BillableItemsUpdatedResponse implements Action {
	readonly type = BillableItemActionTypes.BillableItemsUpdatedResponse;
	constructor(public payload: { billableItem: BillableItem }) { }
}

export class BillableItemDeleted implements Action {
	readonly type = BillableItemActionTypes.BillableItemDeleted;
	constructor(public payload: { id: number }) { }
}

export class BillableItemsPageRequested implements Action {
	readonly type = BillableItemActionTypes.BillableItemsPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class BillableItemsPageLoaded implements Action {
	readonly type = BillableItemActionTypes.BillableItemsPageLoaded;
	constructor(public payload: { billableItems: any, total: number, page: QueryParamsModel }) {
	 }
}

export class BillableItemsPageCancelled implements Action {
	readonly type = BillableItemActionTypes.BillableItemsPageCancelled;
}

export class BillableItemsPageToggleLoading implements Action {
	readonly type = BillableItemActionTypes.BillableItemsPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class BillableItemsActionToggleLoading implements Action {
	readonly type = BillableItemActionTypes.BillableItemsActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GetBillableItemById implements Action {
	readonly type = BillableItemActionTypes.GetBillableItemById;
	constructor(public payload: { id: string }) { }
}

export class GetBillableItemLoadedById implements Action {
	readonly type = BillableItemActionTypes.GetBillableItemLoadedById;
	constructor(public payload: { billableItems: any, total: number }) {
	 }
}

export class BillableItemsForTimeRequested implements Action {
	readonly type = BillableItemActionTypes.BillableItemsForTimeRequested;
	constructor() { }
}

export class BillableItemsForTimeLoadedLoaded implements Action {
	readonly type = BillableItemActionTypes.BillableItemsForTimeLoadedLoaded;
	constructor(public payload: { billableTimeEntries: any, total: number }) {
}
}

export type BillableItemActions = BillableItemCreated
	| BillableItemUpdated
	| BillableItemDeleted
	| BillableItemOnServerCreated
	| BillableItemsPageLoaded
	| BillableItemsPageCancelled
	| BillableItemsPageToggleLoading
	| BillableItemsPageRequested
	| GetBillableItemById
	| GetBillableItemLoadedById
	| BillableItemsUpdatedResponse
	| BillableItemsActionToggleLoading
	| BillableItemsForTimeRequested
	| BillableItemsForTimeLoadedLoaded;
