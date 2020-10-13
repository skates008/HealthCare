// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { Agreement } from '../_models/agreement.model';
// Models
import { QueryParamsModel } from '../../_base/crud';

export enum AgreementActionTypes {
	AllAgreementRequested = '[Agreement Module] All Agreement Requested',
	AllAgreementLoaded = '[Agreement API] All Agreement Loaded',
	AgreementOnServerCreated = '[Edit Agreement Component] Agreement On Server Created',
	AgreementCreated = '[Edit Agreement Dialog] Agreement Created',
	AgreementUpdated = '[Edit Agreement Dialog] Agreement Updated',
	AgreementDeleted = '[Agreement List Page] Agreement Deleted',
	AgreementFileDeleted = '[Agreement Details Page] Agreement File Deleted',
	AgreementPageRequested = '[Agreement List Page] Agreement Page Requested',
	AgreementPageLoaded = '[Agreement API] Agreement Page Loaded',
	AgreementPageCancelled = '[Agreement API] Agreement Page Cancelled',
	AgreementPageToggleLoading = '[Agreement] Agreement Page Toggle Loading',
	AgreementActionToggleLoading = '[Agreement] Agreement Action Toggle Loading',
	GetAgreementDetailsById = '[Agreement] Get Agreement Details By Id',
	GetAgreementDetailsByIdLoaded = '[Agreement] Get Agreement Details By Id Loaded',
	AgreementUpdatedResponse = '[Agreement Updated Response] Agreement Updated Response'
}

export class AgreementOnServerCreated implements Action {
	readonly type = AgreementActionTypes.AgreementOnServerCreated;
	constructor(public payload: { agreement: any, id }) {
	}
}

export class AgreementCreated implements Action {
	readonly type = AgreementActionTypes.AgreementCreated;
	constructor(public payload: { agreement: any }) { }
}


export class AgreementUpdated implements Action {
	readonly type = AgreementActionTypes.AgreementUpdated;
	constructor(public payload: {
		partialAgreement: Update<Agreement>,
		agreement: Agreement
	}) { }
}

export class AgreementUpdatedResponse implements Action {
	readonly type = AgreementActionTypes.AgreementUpdatedResponse;
	constructor(public payload: { agreement: any, success: boolean }) { }
}

export class AgreementDeleted implements Action {
	readonly type = AgreementActionTypes.AgreementDeleted;
	constructor(public payload: { agreement }) { }
}

export class AgreementFileDeleted implements Action {
	readonly type = AgreementActionTypes.AgreementFileDeleted;
	constructor(public payload: { id }) { }
}

export class AgreementPageRequested implements Action {
	readonly type = AgreementActionTypes.AgreementPageRequested;
	constructor(public payload: { participantId, page: QueryParamsModel }) {
	 }
}

export class AgreementPageLoaded implements Action {
	readonly type = AgreementActionTypes.AgreementPageLoaded;
	constructor(public payload: { agreement: any, total: number, page: QueryParamsModel }) { 
	}
}

export class AgreementPageCancelled implements Action {
	readonly type = AgreementActionTypes.AgreementPageCancelled;
}

export class AgreementPageToggleLoading implements Action {
	readonly type = AgreementActionTypes.AgreementPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class AgreementActionToggleLoading implements Action {
	readonly type = AgreementActionTypes.AgreementActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GetAgreementDetailsById implements Action {
	readonly type = AgreementActionTypes.GetAgreementDetailsById;
	constructor(public payload: { agreementId: string }) {
	 }
}

export class GetAgreementDetailsByIdLoaded implements Action {
	readonly type = AgreementActionTypes.GetAgreementDetailsByIdLoaded;
	constructor(public payload: { agreement: any, total: number, success: boolean }) {
	}
}

export type AgreementActions = AgreementCreated
	| AgreementUpdated
	| AgreementDeleted
	| AgreementFileDeleted
	| AgreementOnServerCreated
	| AgreementPageLoaded
	| AgreementPageCancelled
	| AgreementPageToggleLoading
	| AgreementPageRequested
	| GetAgreementDetailsById
	| GetAgreementDetailsByIdLoaded
	| AgreementUpdatedResponse
	| AgreementActionToggleLoading;
