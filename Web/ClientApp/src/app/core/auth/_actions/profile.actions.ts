import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { Profile } from '../_models/profile.model';
import { Password } from '../_models/password.model';

export enum ProfileActionTypes {
	AllProfilesRequested = '[Profiles Module] All Profiles Requested',
	AllProfilesLoaded = '[Profiles API] All Profiles Loaded',
	ProfileOnServerCreated = '[Edit Profile Component] Profile On Server Created',
	ProfileCreated = '[Edit Profile Dialog] Profile Created',
	ProfileUpdated = '[Edit Profile Dialog] Profile Updated',
	ProfileUpdatedLoaded = '[Edit Profile Dialog] Profile Updated',
	ProfileDeleted = '[Profiles List Page] Profile Deleted',
	ProfilesPageRequested = '[Profiles List Page] Profiles Page Requested',
	ProfilesPageLoaded = '[Profiles API] Profiles Page Loaded',
	ProfilesPageCancelled = '[Profiles API] Profiles Page Cancelled',
	ProfilesPageToggleLoading = '[Profiles] Profiles Page Toggle Loading',
	ProfilesActionToggleLoading = '[Profiles] Profiles Action Toggle Loading',
	GenerateSummaryPlan = '[Profile] Generate Plan Summary Pdf',
	getProfileDetails = '[Profile View] Get Profile By Id',
	ProfileDetailsLoaded= '[Profile Detail View] Get Profile Details By Id',
	ProfileEditPageRequested = '[Profile Edit Page] Get Profile Edit List',
	ProfilesEditPageLoaded ='[Profile Edit Page Loaded] Profile Edit Page List Loaded',
}

export class ProfileUpdated implements Action {
	readonly type = ProfileActionTypes.ProfileUpdated;
	constructor(public payload: {
		profile: Profile
	}) { }
}

export class ProfileUpdatedLoaded implements Action {
	readonly type = ProfileActionTypes.ProfileUpdatedLoaded;
	constructor(public payload: { profile: any, success: boolean }) {
	 }
}

export class ProfilesPageRequested implements Action {
	readonly type = ProfileActionTypes.ProfilesPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class ProfilesPageLoaded implements Action {
	readonly type = ProfileActionTypes.ProfilesPageLoaded;
	constructor(public payload: { profiles: Profile[], total: number, success: boolean }) {
	 }
}

export class ProfilesPageCancelled implements Action {
	readonly type = ProfileActionTypes.ProfilesPageCancelled;
}

export class ProfilesPageToggleLoading implements Action {
	readonly type = ProfileActionTypes.ProfilesPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class ProfilesActionToggleLoading implements Action {
	readonly type = ProfileActionTypes.ProfilesActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class getProfileDetails implements Action {
	readonly type = ProfileActionTypes.getProfileDetails;
	constructor(public payload: { Profile: any }) { 
	}
}

export class ProfileDetailsLoaded implements Action {
	readonly type = ProfileActionTypes.ProfileDetailsLoaded;
	constructor(public payload: { profiles: any, page: QueryParamsModel }) {
	 }
}


export class ProfileEditPageRequested implements Action {
	readonly type = ProfileActionTypes.ProfileEditPageRequested
	constructor(public payload: { }) {
	 }
}


export class ProfilesEditPageLoaded implements Action {
	readonly type = ProfileActionTypes.ProfilesEditPageLoaded;
	constructor(public payload: { profiles: any }) {
	 }
}

export type ProfileActions = ProfileUpdated
	| ProfilesPageLoaded
	| ProfileUpdatedLoaded
	| ProfilesPageCancelled
	| ProfilesPageToggleLoading
	| ProfilesPageRequested
	| getProfileDetails
	| ProfileDetailsLoaded
	| ProfileEditPageRequested
	| ProfilesEditPageLoaded
	| ProfilesActionToggleLoading;
