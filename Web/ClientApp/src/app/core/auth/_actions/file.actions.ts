// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { Files } from '../_models/file.model';
// Models
import { QueryParamsModel } from '../../_base/crud';

export enum FileActionTypes {
	AllFileRequested = '[File Module] All File Requested',
	AllFileLoaded = '[File API] All File Loaded',
	FileOnServerCreated = '[Edit File Component] File On Server Created',
	FileCreated = '[Edit File Dialog] File Created',
	FileUpdated = '[Edit File Dialog] File Updated',
	FileDeleted = '[File List Page] File Deleted',
	FileDownload = '[File List Page] File Downloaded',
	FileFileDeleted = '[File Details Page] File File Deleted',
	FilePageRequested = '[File List Page] File Page Requested',
	FilePageLoaded = '[File API] File Page Loaded',
	FilePageCancelled = '[File API] File Page Cancelled',
	FilePageToggleLoading = '[File] File Page Toggle Loading',
	FileActionToggleLoading = '[File] File Action Toggle Loading',
	GetFileDetailsById = '[File] Get File Details By Id',
	GetFileDetailsByIdLoaded = '[File] Get File Details By Id Loaded',
	FileUpdatedResponse = '[File Updated Response] File Updated Response'
}

export class FileOnServerCreated implements Action {
	readonly type = FileActionTypes.FileOnServerCreated;
	constructor(public payload: { file: any, id }) {
	}
}

export class FileCreated implements Action {
	readonly type = FileActionTypes.FileCreated;
	constructor(public payload: { file: any }) { }
}


export class FileUpdated implements Action {
	readonly type = FileActionTypes.FileUpdated;
	constructor(public payload: {
		partialFile: Update<Files>,
		file: Files
	}) { }
}

export class FileUpdatedResponse implements Action {
	readonly type = FileActionTypes.FileUpdatedResponse;
	constructor(public payload: { file: any, success: boolean }) { }
}

export class FileDeleted implements Action {
	readonly type = FileActionTypes.FileDeleted;
	constructor(public payload: { file }) { }
}

export class FileDownload implements Action {
	readonly type = FileActionTypes.FileDownload;
	constructor(public payload: { id }) { }
}


export class FilePageRequested implements Action {
	readonly type = FileActionTypes.FilePageRequested;
	constructor(public payload: { participantId, page: QueryParamsModel }) {
	 }
}

export class FilePageLoaded implements Action {
	readonly type = FileActionTypes.FilePageLoaded;
	constructor(public payload: { file: any, total: number, page: QueryParamsModel }) {
	}
}

export class FilePageCancelled implements Action {
	readonly type = FileActionTypes.FilePageCancelled;
}

export class FilePageToggleLoading implements Action {
	readonly type = FileActionTypes.FilePageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class FileActionToggleLoading implements Action {
	readonly type = FileActionTypes.FileActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GetFileDetailsById implements Action {
	readonly type = FileActionTypes.GetFileDetailsById;
	constructor(public payload: { fileId: string }) {
	 }
}

export class GetFileDetailsByIdLoaded implements Action {
	readonly type = FileActionTypes.GetFileDetailsByIdLoaded;
	constructor(public payload: { file: any, total: number, success: boolean }) {
	}
}

export type FileActions = FileCreated
	| FileUpdated
	| FileDeleted
	| FileDownload
	| FileOnServerCreated
	| FilePageLoaded
	| FilePageCancelled
	| FilePageToggleLoading
	| FilePageRequested
	| GetFileDetailsById
	| GetFileDetailsByIdLoaded
	| FileUpdatedResponse
	| FileActionToggleLoading;
