import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Participant } from '../_models/participant.model';

import { QueryParamsModel } from '../../_base/crud';

export enum ParticipantActionTypes {
	AllParticipantsRequested = '[Participants Module] All Participants Requested',
	AllParticipantsLoaded = '[Participants API] All Participants Loaded',
	ParticipantOnServerCreated = '[Edit Participant Component] Participant On Server Created',
	ParticipantCreated = '[Edit Participant Dialog] Participant Created',
	ParticipantUpdated = '[Edit Participant Dialog] Participant Updated',
	ParticipantDeleted = '[Participants List Page] Participant Deleted',
	ParticipantsPageRequested = '[Participants List Page] Participants Page Requested',
	CareplanParticipantsPageRequested = '[Careplan Participants List Page] Careplan Participants Page Requested',
	ParticipantsPageLoaded = '[Participants API] Participants Page Loaded',
	ParticipantsPageCancelled = '[Participants API] Participants Page Cancelled',
	ParticipantsPageToggleLoading = '[Participants] Participants Page Toggle Loading',
	ParticipantsActionToggleLoading = '[Participants] Participants Action Toggle Loading',
	GetParticipantById = '[ Participant Profile] Get Participant By Id',
	ParticipantByIdLoaded ='[Participant Id] Participant By Id Loaded',
	InitRegistration = '[Init Registration] Participant Registration Data',
	InitRegristrationLoaded = '[Init Registration] Init Registration Loaded',
	RegistrationComplete = '[Registration Complete] Participant Registration Complete',
	RegistrationCompleteLoaded =  '[Registration Complete Loaded] Participant Registration Loaded',
	ParticipantEditPageRequested = '[Particioant Page Requested] Participant Edit Page Requested',
	ParticipantEditPageLoaded = '[Particioant Page Loaded] Participant Edit Page Loaded',
	ParticipantProfilePageRequested = '[Participant Profile Requested] Participant Profile Page Requested',
	ParticipantProfilePageLoaded = '[Participant Profile Loaded] Participant Profile Page Loaded',
	ParticipantUpdatedResponse = '[Participant Updated] Particpant Updated Response'
}
 
export class ParticipantOnServerCreated implements Action {
	readonly type = ParticipantActionTypes.ParticipantOnServerCreated;
	constructor(public payload: { participant: Participant }) { }
}

export class ParticipantCreated implements Action {
	readonly type = ParticipantActionTypes.ParticipantCreated;
	constructor(public payload: { participant: any }) { }
}

export class ParticipantUpdated implements Action {
	readonly type = ParticipantActionTypes.ParticipantUpdated;
	constructor(public payload: {
		partialParticipant: Update<Participant>,
		participant: Participant
	}) { }
}

export class ParticipantUpdatedResponse implements Action {
	readonly type = ParticipantActionTypes.ParticipantUpdatedResponse;
	constructor(public payload: { participant: any }) { }
}

export class ParticipantDeleted implements Action {
	readonly type = ParticipantActionTypes.ParticipantDeleted;
	constructor(public payload: { id: number }) { }
}

export class ParticipantsPageRequested implements Action {
	readonly type = ParticipantActionTypes.ParticipantsPageRequested;
	constructor(public payload: { page: QueryParamsModel }) {

	 }
}

export class CareplanParticipantsPageRequested implements Action {
	readonly type = ParticipantActionTypes.CareplanParticipantsPageRequested;
	constructor(public payload: { page: QueryParamsModel }) {
	 }
}

export class ParticipantsPageLoaded implements Action {
	readonly type = ParticipantActionTypes.ParticipantsPageLoaded;
	constructor(public payload: { participants: Participant[], total: number, success: boolean, page: QueryParamsModel }) { }
}

export class ParticipantsPageCancelled implements Action {
	readonly type = ParticipantActionTypes.ParticipantsPageCancelled;
}

export class AllParticipantsRequested implements Action {
    readonly type = ParticipantActionTypes.AllParticipantsRequested;
}

export class ParticipantsPageToggleLoading implements Action {
	readonly type = ParticipantActionTypes.ParticipantsPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class AllParticipantsLoaded implements Action {
    readonly type = ParticipantActionTypes.AllParticipantsLoaded;
    constructor(public payload: { participants: any }) { }
}

export class ParticipantsActionToggleLoading implements Action {
	readonly type = ParticipantActionTypes.ParticipantsActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GetParticipantById implements Action {
	readonly type = ParticipantActionTypes.GetParticipantById;
	constructor(public payload: {participant_id: any}) { }
}

export class ParticipantByIdLoaded implements Action {
	readonly type = ParticipantActionTypes.ParticipantByIdLoaded;
	constructor(public payload: { participant: any}) { }
}

export class InitRegistration implements Action {
	readonly type = ParticipantActionTypes.InitRegistration;
	constructor(public payload: {participant: any}) { }
}

export class InitRegristrationLoaded implements Action {
	readonly type = ParticipantActionTypes.InitRegristrationLoaded;
	constructor(public payload: { participant: any}) { }
}

export class ParticipantEditPageRequested implements Action {
	readonly type = ParticipantActionTypes.ParticipantEditPageRequested;
	constructor(public payload: { participantId: string }) {

	 }
}

export class ParticipantEditPageLoaded implements Action {
	readonly type = ParticipantActionTypes.ParticipantEditPageLoaded;
	constructor(public payload: { participants: any, success: boolean }) { }
}



//Registraion Participant
export class RegistrationComplete implements Action {
	readonly type = ParticipantActionTypes.RegistrationComplete;
	constructor(public payload: {registrationData: any}) { }
}

export class RegistrationCompleteLoaded implements Action {
	readonly type = ParticipantActionTypes.RegistrationCompleteLoaded;
	constructor(public payload: { registrationCompleteData: any, success: boolean}) { }
}

export class ParticipantProfilePageRequested implements Action {
	readonly type = ParticipantActionTypes.ParticipantProfilePageRequested;
	constructor(public payload: {}) {

	 }
}

export class ParticipantProfilePageLoaded implements Action {
	readonly type = ParticipantActionTypes.ParticipantProfilePageLoaded;
	constructor(public payload: { participant: any, total: number, success: boolean}) { }
}


export type ParticipantActions = ParticipantCreated
	| ParticipantUpdated
	| ParticipantDeleted
	| ParticipantOnServerCreated
	| ParticipantsPageLoaded
	| ParticipantsPageCancelled
	| AllParticipantsRequested
	| ParticipantsPageToggleLoading
	| ParticipantsPageRequested
	| CareplanParticipantsPageRequested
	| AllParticipantsLoaded
	| GetParticipantById
	| ParticipantByIdLoaded
	| InitRegistration
	| InitRegristrationLoaded
	| RegistrationComplete
	| RegistrationCompleteLoaded
	| ParticipantEditPageLoaded
	| ParticipantEditPageRequested
	| ParticipantsActionToggleLoading
	| ParticipantProfilePageRequested
	| ParticipantUpdatedResponse
	| ParticipantProfilePageLoaded;

