// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { Assessment } from '../_models/assessment.model';
// Models
import { QueryParamsModel } from '../../_base/crud';

export enum AssessmentActionTypes {
	AllAssessmentRequested = '[Assessment Module] All Assessment Requested',
	AllAssessmentLoaded = '[Assessment API] All Assessment Loaded',
	AssessmentOnServerCreated = '[Edit Assessment Component] Assessment On Server Created',
	AssessmentCreated = '[Edit Assessment Dialog] Assessment Created',
	AssessmentUpdated = '[Edit Assessment Dialog] Assessment Updated',
	AssessmentDeleted = '[Assessment List Page] Assessment Deleted',
	AssessmentFileDeleted = '[Assessment Details Page] Assessment File Deleted',
	AssessmentPageRequested = '[Assessment List Page] Assessment Page Requested',
	AssessmentPageLoaded = '[Assessment API] Assessment Page Loaded',
	AssessmentPageCancelled = '[Assessment API] Assessment Page Cancelled',
	AssessmentPageToggleLoading = '[Assessment] Assessment Page Toggle Loading',
	AssessmentActionToggleLoading = '[Assessment] Assessment Action Toggle Loading',
	GetAssessmentDetailsById = '[Assessment] Get Assessment Details By Id',
	GetAssessmentDetailsByIdLoaded = '[Assessment] Get Assessment Details By Id Loaded',
	AssessmentUpdatedResponse = '[Assessment Updated Response] Assessment Updated Response'
}

export class AssessmentOnServerCreated implements Action {
	readonly type = AssessmentActionTypes.AssessmentOnServerCreated;
	constructor(public payload: { assessment: any, id }) {
	}
}

export class AssessmentCreated implements Action {
	readonly type = AssessmentActionTypes.AssessmentCreated;
	constructor(public payload: { assessment: any }) { }
}


export class AssessmentUpdated implements Action {
	readonly type = AssessmentActionTypes.AssessmentUpdated;
	constructor(public payload: {
		partialAssessment: Update<Assessment>,
		assessment: Assessment
	}) { }
}

export class AssessmentUpdatedResponse implements Action {
	readonly type = AssessmentActionTypes.AssessmentUpdatedResponse;
	constructor(public payload: { assessment: any, success: boolean }) { }
}

export class AssessmentDeleted implements Action {
	readonly type = AssessmentActionTypes.AssessmentDeleted;
	constructor(public payload: { assessment }) { }
}

export class AssessmentFileDeleted implements Action {
	readonly type = AssessmentActionTypes.AssessmentFileDeleted;
	constructor(public payload: { id }) { }
}

export class AssessmentPageRequested implements Action {
	readonly type = AssessmentActionTypes.AssessmentPageRequested;
	constructor(public payload: { participantId, page: QueryParamsModel }) {
	 }
}

export class AssessmentPageLoaded implements Action {
	readonly type = AssessmentActionTypes.AssessmentPageLoaded;
	constructor(public payload: { assessment: any, total: number, page: QueryParamsModel }) { 
	}
}

export class AssessmentPageCancelled implements Action {
	readonly type = AssessmentActionTypes.AssessmentPageCancelled;
}

export class AssessmentPageToggleLoading implements Action {
	readonly type = AssessmentActionTypes.AssessmentPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class AssessmentActionToggleLoading implements Action {
	readonly type = AssessmentActionTypes.AssessmentActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GetAssessmentDetailsById implements Action {
	readonly type = AssessmentActionTypes.GetAssessmentDetailsById;
	constructor(public payload: { assessmentId: string }) {
	 }
}

export class GetAssessmentDetailsByIdLoaded implements Action {
	readonly type = AssessmentActionTypes.GetAssessmentDetailsByIdLoaded;
	constructor(public payload: { assessment: any, total: number, success: boolean }) {
	}
}

export type AssessmentActions = AssessmentCreated
	| AssessmentUpdated
	| AssessmentDeleted
	| AssessmentFileDeleted
	| AssessmentOnServerCreated
	| AssessmentPageLoaded
	| AssessmentPageCancelled
	| AssessmentPageToggleLoading
	| AssessmentPageRequested
	| GetAssessmentDetailsById
	| GetAssessmentDetailsByIdLoaded
	| AssessmentUpdatedResponse
	| AssessmentActionToggleLoading;
