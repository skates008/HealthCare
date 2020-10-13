import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { Time } from '../_models/time.model';

export enum TimeActionTypes {
	AllTimesRequested = '[Times Module] All Times Requested',
	AllTimesLoaded = '[Times API] All Times Loaded',
	TimeOnServerCreated = '[Edit Time Component] Time On Server Created',
	TimeCreated = '[Edit Time Dialog] Time Created',
	TimeUpdated = '[Edit Time Dialog] Time Updated',
	TimeDeleted = '[Times List Page] Time Deleted',
	TimesPageRequested = '[Times List Page] Times Page Requested',
	TimesPageLoaded = '[Times API] Times Page Loaded',
	TimesPageCancelled = '[Times API] Times Page Cancelled',
	TimesPageToggleLoading = '[Times] Times Page Toggle Loading',
	TimesActionToggleLoading = '[Times] Times Action Toggle Loading',
	TimeEntryDetailsByID= '[Times View Component] Time Entry Details View By Id',
	TimeEntryDetailsByIdLoaded= '[Times View Component] Time Entry Details Loaded By Id',
	TimeUpdatedLoaded= '[Times Edit Component] Time Updated Loaded',
	StatementPageRequested= '[Statement Component] Statement Lists For Patient',
	StatementPageLoaded= '[Statement Component] Statement Loaded',
	StatementViewPageRequested= '[Statement Component] Statement View Requested For Patient',
	StatementViewPageLoaded= '[Statement Component] Statement View Loaded For Patient',

}

export class TimeOnServerCreated implements Action {
	readonly type = TimeActionTypes.TimeOnServerCreated;
	constructor(public payload: { time: Time }) { }
}

export class TimeCreated implements Action {
	readonly type = TimeActionTypes.TimeCreated;
	constructor(public payload: { time: any, success: boolean }) { }
}


export class TimeUpdated implements Action {
	readonly type = TimeActionTypes.TimeUpdated;
	constructor(public payload: {
		partialTime: Update<Time>,
		time: Time
	}) { }
}


export class TimeUpdatedLoaded implements Action {
	readonly type = TimeActionTypes.TimeUpdatedLoaded;
	constructor(public payload: { time: any, success: boolean }) { }
}

export class TimeDeleted implements Action {
	readonly type = TimeActionTypes.TimeDeleted;
	constructor(public payload: { id }) { }
}

export class TimesPageRequested implements Action {
	readonly type = TimeActionTypes.TimesPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class TimesPageLoaded implements Action {
	readonly type = TimeActionTypes.TimesPageLoaded;
	constructor(public payload: { times: Time[], total: number, page: QueryParamsModel}) {
	 }
}

export class TimesPageCancelled implements Action {
	readonly type = TimeActionTypes.TimesPageCancelled;
}

export class TimesPageToggleLoading implements Action {
	readonly type = TimeActionTypes.TimesPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class TimesActionToggleLoading implements Action {
	readonly type = TimeActionTypes.TimesActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}



export class TimeEntryDetailsByID implements Action {
	readonly type = TimeActionTypes.TimeEntryDetailsByID;
	constructor(public payload: {timeEntryId: string }){}
}
export class TimeEntryDetailsByIdLoaded implements Action {
	readonly type = TimeActionTypes.TimeEntryDetailsByIdLoaded;
	constructor(public payload: { times: any, total: number, success: boolean }) {
		}
}

export class StatementPageRequested implements Action {
	readonly type = TimeActionTypes.StatementPageRequested;
	constructor() { }
}

export class StatementPageLoaded implements Action {
	readonly type = TimeActionTypes.StatementPageLoaded;
	constructor(public payload: { times: any, total: number , success: boolean }) {
 }
}

export class StatementViewPageRequested implements Action {
	readonly type = TimeActionTypes.StatementViewPageRequested;
	constructor(public payload: { StatementId: string }) { }
}

export class StatementViewPageLoaded implements Action {
	readonly type = TimeActionTypes.StatementViewPageLoaded;
	constructor(public payload: { times: any, total: number , success: boolean }) {
 }
}

export type TimeActions = TimeCreated
	| TimeUpdated
	| TimeDeleted
	| TimeOnServerCreated
	| TimesPageLoaded
	| TimesPageCancelled
	| TimesPageToggleLoading
	| TimesPageRequested
	| TimeEntryDetailsByID
	| TimeEntryDetailsByIdLoaded
	| TimesActionToggleLoading
	| TimeUpdatedLoaded
	| StatementPageRequested
	| StatementPageLoaded
	| StatementViewPageRequested
	| StatementViewPageLoaded;
