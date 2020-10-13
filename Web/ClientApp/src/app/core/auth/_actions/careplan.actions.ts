import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { Careplan } from '../_models/careplan.model';

export enum CareplanActionTypes {
	AllCareplansRequested = '[Careplans Module] All Careplans Requested',
	AllCareplansLoaded = '[Careplans API] All Careplans Loaded',
	CareplanOnServerCreated = '[Edit Careplan Component] Careplan On Server Created',
	CareplanCreated = '[Edit Careplan Dialog] Careplan Created',
	CareplanUpdated = '[Edit Careplan Dialog] Careplan Updated',
	CareplanDeleted = '[Careplans List Page] Careplan Deleted',
	CareplansPageRequested = '[Careplans List Page] Careplans Page Requested',
	CareplansPageLoaded = '[Careplans API] Careplans Page Loaded',
	CareplansPageCancelled = '[Careplans API] Careplans Page Cancelled',
	CareplansPageToggleLoading = '[Careplans] Careplans Page Toggle Loading',
	CareplansActionToggleLoading = '[Careplans] Careplans Action Toggle Loading',
	GenerateSummaryPlan = '[Careplan] Generate Plan Summary Pdf',
	getCareplanDetails = '[Careplan View] Get Careplan By Id',
	CareplanDetailsLoaded= '[Careplan Detail View] Get Careplan Details By Id',
	CarePlanEditPageRequested = '[Careplan Edit Page] Get Careplan Edit List',
	CareplansEditPageLoaded = '[Careplan Edit Page Loaded] Careplan Edit Page List Loaded',
	CareplanListRequestedForTimeEntry = '[Time Edit Component] Careplan List Requested for Times',
	CareplanListLoadedForTimeEntry = '[Time Edit Component] Careplan List Loaded for Times'

}

export class CareplanOnServerCreated implements Action {
	readonly type = CareplanActionTypes.CareplanOnServerCreated;
	constructor(public payload: { careplan: Careplan }) { }
}

export class CareplanCreated implements Action {
	readonly type = CareplanActionTypes.CareplanCreated;
	constructor(public payload: { careplan: any, success: boolean }) { }
}

export class CareplanUpdated implements Action {
	readonly type = CareplanActionTypes.CareplanUpdated;
	constructor(public payload: {
		partialCareplan: Update<Careplan>,
		careplan: Careplan
	}) {

	 }
}

export class CareplanDeleted implements Action {
	readonly type = CareplanActionTypes.CareplanDeleted;
	constructor(public payload: { id: any }) {
	 }
}

export class CareplansPageRequested implements Action {
	readonly type = CareplanActionTypes.CareplansPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class CareplansPageLoaded implements Action {
	readonly type = CareplanActionTypes.CareplansPageLoaded;
	constructor(public payload: { careplans: any, total: number, page: QueryParamsModel }) {
	 }
}

export class CareplansPageCancelled implements Action {
	readonly type = CareplanActionTypes.CareplansPageCancelled;
}

export class CareplansPageToggleLoading implements Action {
	readonly type = CareplanActionTypes.CareplansPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class CareplansActionToggleLoading implements Action {
	readonly type = CareplanActionTypes.CareplansActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GenerateSummaryPlan implements Action {
	readonly type = CareplanActionTypes.GenerateSummaryPlan;
	constructor(public payload: { Careplan: any }) { }
}

export class getCareplanDetails implements Action {
	readonly type = CareplanActionTypes.getCareplanDetails;
	constructor(public payload: { Careplan: any }) {
	}
}

export class CareplanDetailsLoaded implements Action {
	readonly type = CareplanActionTypes.CareplanDetailsLoaded;
	constructor(public payload: { careplans: any, page: QueryParamsModel }) {
	 }
}


export class CarePlanEditPageRequested implements Action {
	readonly type = CareplanActionTypes.CarePlanEditPageRequested
	constructor(public payload: { Careplan: any }) {
	 }
}


export class CareplansEditPageLoaded implements Action {
	readonly type = CareplanActionTypes.CareplansEditPageLoaded;
	constructor(public payload: { careplans: any, total: number }) {
	 }
}

export class CareplanListRequestedForTimeEntry implements Action {
	readonly type = CareplanActionTypes.CareplanListRequestedForTimeEntry;
	constructor(public payload: {}) { }
}

export class CareplanListLoadedForTimeEntry implements Action {
	readonly type = CareplanActionTypes.CareplanListLoadedForTimeEntry;
	constructor(public payload: { careplans: any, total: number}) {
	 }
}


export type CareplanActions = CareplanCreated
	| CareplanUpdated
	| CareplanDeleted
	| CareplanOnServerCreated
	| CareplansPageLoaded
	| CareplansPageCancelled
	| CareplansPageToggleLoading
	| CareplansPageRequested
	| GenerateSummaryPlan
	| getCareplanDetails
	| CareplanDetailsLoaded
	| CarePlanEditPageRequested
	| CareplansEditPageLoaded
	| CareplanListRequestedForTimeEntry
	| CareplanListLoadedForTimeEntry
	| CareplansActionToggleLoading;
