// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { UserNote } from '../_models/userNote.model';
// Models
import { QueryParamsModel } from '../../_base/crud';

export enum UserNoteActionTypes {
	AllUserNoteRequested = '[UserNote Module] All UserNote Requested',
	AllUserNoteLoaded = '[UserNote API] All UserNote Loaded',
	UserNoteOnServerCreated = '[Edit UserNote Component] UserNote On Server Created',
	UserNoteCreated = '[Edit UserNote Dialog] UserNote Created',
	UserNoteUpdated = '[Edit UserNote Dialog] UserNote Updated',
	UserNoteDeleted = '[UserNote List Page] UserNote Deleted',
	UserNoteFileDeleted = '[UserNote Details Page] UserNote File Deleted',
	UserNotePageRequested = '[UserNote List Page] UserNote Page Requested',
	UserNotePageLoaded = '[UserNote API] UserNote Page Loaded',
	UserNotePageCancelled = '[UserNote API] UserNote Page Cancelled',
	UserNotePageToggleLoading = '[UserNote] UserNote Page Toggle Loading',
	UserNoteActionToggleLoading = '[UserNote] UserNote Action Toggle Loading',
	GetUserNoteDetailsById = '[UserNote] Get UserNote Details By Id',
	GetUserNoteDetailsByIdLoaded = '[UserNote] Get UserNote Details By Id Loaded',
	UserNoteUpdatedResponse = '[UserNote Updated Response] UserNote Updated Response'
}

export class UserNoteOnServerCreated implements Action {
	readonly type = UserNoteActionTypes.UserNoteOnServerCreated;
	constructor(public payload: { userNote: any, id }) {
	}
}

export class UserNoteCreated implements Action {
	readonly type = UserNoteActionTypes.UserNoteCreated;
	constructor(public payload: { userNote: any }) { }
}


export class UserNoteUpdated implements Action {
	readonly type = UserNoteActionTypes.UserNoteUpdated;
	constructor(public payload: {
		partialUserNote: Update<UserNote>,
		userNote: UserNote
	}) { }
}

export class UserNoteUpdatedResponse implements Action {
	readonly type = UserNoteActionTypes.UserNoteUpdatedResponse;
	constructor(public payload: { userNote: any, success: boolean }) { }
}

export class UserNoteDeleted implements Action {
	readonly type = UserNoteActionTypes.UserNoteDeleted;
	constructor(public payload: { userNote }) { }
}

export class UserNoteFileDeleted implements Action {
	readonly type = UserNoteActionTypes.UserNoteFileDeleted;
	constructor(public payload: { id }) { }
}

export class UserNotePageRequested implements Action {
	readonly type = UserNoteActionTypes.UserNotePageRequested;
	constructor(public payload: { participantId, page: QueryParamsModel }) {
	 }
}

export class UserNotePageLoaded implements Action {
	readonly type = UserNoteActionTypes.UserNotePageLoaded;
	constructor(public payload: { userNote: any, total: number, page: QueryParamsModel }) { 
	}
}

export class UserNotePageCancelled implements Action {
	readonly type = UserNoteActionTypes.UserNotePageCancelled;
}

export class UserNotePageToggleLoading implements Action {
	readonly type = UserNoteActionTypes.UserNotePageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class UserNoteActionToggleLoading implements Action {
	readonly type = UserNoteActionTypes.UserNoteActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GetUserNoteDetailsById implements Action {
	readonly type = UserNoteActionTypes.GetUserNoteDetailsById;
	constructor(public payload: { userNoteId: string }) {
	 }
}

export class GetUserNoteDetailsByIdLoaded implements Action {
	readonly type = UserNoteActionTypes.GetUserNoteDetailsByIdLoaded;
	constructor(public payload: { userNote: any, total: number, success: boolean }) {
	}
}

export type UserNoteActions = UserNoteCreated
	| UserNoteUpdated
	| UserNoteDeleted
	| UserNoteFileDeleted
	| UserNoteOnServerCreated
	| UserNotePageLoaded
	| UserNotePageCancelled
	| UserNotePageToggleLoading
	| UserNotePageRequested
	| GetUserNoteDetailsById
	| GetUserNoteDetailsByIdLoaded
	| UserNoteUpdatedResponse
	| UserNoteActionToggleLoading;
