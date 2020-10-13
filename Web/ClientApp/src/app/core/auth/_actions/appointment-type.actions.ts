// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { AppointmentType } from '../_models/appointment-type.model';
// Models
import { QueryParamsModel } from '../../_base/crud';

export enum AppointmentTypeActionTypes {
	AllAppointmentTypeRequested = '[AppointmentType Module] All AppointmentType Requested',
	AllAppointmentTypeLoaded = '[AppointmentType API] All AppointmentType Loaded',
	AppointmentTypeOnServerCreated = '[Edit AppointmentType Component] AppointmentType On Server Created',
	AppointmentTypeCreated = '[Edit AppointmentType Dialog] AppointmentType Created',
	AppointmentTypeUpdated = '[Edit AppointmentType Dialog] AppointmentType Updated',
	AppointmentTypeDeleted = '[AppointmentType List Page] AppointmentType Deleted',
	AppointmentTypeFileDeleted = '[AppointmentType Details Page] AppointmentType File Deleted',
	AppointmentTypePageRequested = '[AppointmentType List Page] AppointmentType Page Requested',
	AppointmentTypePageLoaded = '[AppointmentType API] AppointmentType Page Loaded',
	AppointmentTypePageCancelled = '[AppointmentType API] AppointmentType Page Cancelled',
	AppointmentTypePageToggleLoading = '[AppointmentType] AppointmentType Page Toggle Loading',
	AppointmentTypeActionToggleLoading = '[AppointmentType] AppointmentType Action Toggle Loading',
	GetAppointmentTypeDetailsById = '[AppointmentType] Get AppointmentType Details By Id',
	GetAppointmentTypeDetailsByIdLoaded = '[AppointmentType] Get AppointmentType Details By Id Loaded',
	AppointmentTypeUpdatedResponse = '[AppointmentType Updated Response] AppointmentType Updated Response'
}

export class AppointmentTypeOnServerCreated implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypeOnServerCreated;
	constructor(public payload: { appointmentType: any }) {
	}
}

export class AppointmentTypeCreated implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypeCreated;
	constructor(public payload: { appointmentType: any }) { }
}


export class AppointmentTypeUpdated implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypeUpdated;
	constructor(public payload: {
		partialAppointmentType: Update<AppointmentType>,
		appointmentType: AppointmentType
	}) { }
}

export class AppointmentTypeUpdatedResponse implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypeUpdatedResponse;
	constructor(public payload: { appointmentType: any, success: boolean }) { }
}

export class AppointmentTypeDeleted implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypeDeleted;
	constructor(public payload: { appointmentType }) { }
}

export class AppointmentTypeFileDeleted implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypeFileDeleted;
	constructor(public payload: { id }) { }
}

export class AppointmentTypePageRequested implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypePageRequested;
	constructor(public payload: { page: QueryParamsModel }) {
	 }
}

export class AppointmentTypePageLoaded implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypePageLoaded;
	constructor(public payload: { appointmentType: any, total: number, page: QueryParamsModel }) {
	}
}

export class AppointmentTypePageCancelled implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypePageCancelled;
}

export class AppointmentTypePageToggleLoading implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypePageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class AppointmentTypeActionToggleLoading implements Action {
	readonly type = AppointmentTypeActionTypes.AppointmentTypeActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GetAppointmentTypeDetailsById implements Action {
	readonly type = AppointmentTypeActionTypes.GetAppointmentTypeDetailsById;
	constructor(public payload: { appointmentTypeId: string }) {
	 }
}

export class GetAppointmentTypeDetailsByIdLoaded implements Action {
	readonly type = AppointmentTypeActionTypes.GetAppointmentTypeDetailsByIdLoaded;
	constructor(public payload: { appointmentType: any, total: number, success: boolean }) {
	}
}

export type AppointmentTypeActions = AppointmentTypeCreated
	| AppointmentTypeUpdated
	| AppointmentTypeDeleted
	| AppointmentTypeFileDeleted
	| AppointmentTypeOnServerCreated
	| AppointmentTypePageLoaded
	| AppointmentTypePageCancelled
	| AppointmentTypePageToggleLoading
	| AppointmentTypePageRequested
	| GetAppointmentTypeDetailsById
	| GetAppointmentTypeDetailsByIdLoaded
	| AppointmentTypeUpdatedResponse
	| AppointmentTypeActionToggleLoading;
