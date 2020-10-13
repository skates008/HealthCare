import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { TherapyService } from '../_models/therapyService.model';

export enum TherapyServiceActionTypes {
	AllTherapyServicesRequested = '[TherapyServices Module] All TherapyServices Requested',
	AllTherapyServicesLoaded = '[TherapyServices API] All TherapyServices Loaded',
	TherapyServiceOnServerCreated = '[Edit TherapyService Component] TherapyService On Server Created',
	TherapyServiceCreated = '[Edit TherapyService Dialog] TherapyService Created',
	TherapyServiceUpdated = '[Edit TherapyService Dialog] TherapyService Updated',
	TherapyServiceDeleted = '[TherapyServices List Page] TherapyService Deleted',
	TherapyServicesPageRequested = '[TherapyServices List Page] TherapyServices Page Requested',
	TherapyServicesPageLoaded = '[TherapyServices API] TherapyServices Page Loaded',
	TherapyServicesPageCancelled = '[TherapyServices API] TherapyServices Page Cancelled',
	TherapyServicesPageToggleLoading = '[TherapyServices] TherapyServices Page Toggle Loading',
	TherapyServicesActionToggleLoading = '[TherapyServices] TherapyServices Action Toggle Loading'
}

export class TherapyServiceOnServerCreated implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServiceOnServerCreated;
	constructor(public payload: { therapyService: TherapyService }) { }
}

export class TherapyServiceCreated implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServiceCreated;
	constructor(public payload: { therapyService: TherapyService }) { }
}

export class TherapyServiceUpdated implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServiceUpdated;
	constructor(public payload: {
		partialTherapyService: Update<TherapyService>,
		therapyService: TherapyService
	}) { }
}

export class TherapyServiceDeleted implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServiceDeleted;
	constructor(public payload: { id: number }) { }
}

export class TherapyServicesPageRequested implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServicesPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class TherapyServicesPageLoaded implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServicesPageLoaded;
	constructor(public payload: { therapyServices: TherapyService[], total: number, page: QueryParamsModel }) {
	 }
}

export class TherapyServicesPageCancelled implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServicesPageCancelled;
}

export class TherapyServicesPageToggleLoading implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServicesPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class TherapyServicesActionToggleLoading implements Action {
	readonly type = TherapyServiceActionTypes.TherapyServicesActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export type TherapyServiceActions = TherapyServiceCreated
	| TherapyServiceUpdated
	| TherapyServiceDeleted
	| TherapyServiceOnServerCreated
	| TherapyServicesPageLoaded
	| TherapyServicesPageCancelled
	| TherapyServicesPageToggleLoading
	| TherapyServicesPageRequested
	| TherapyServicesActionToggleLoading;
