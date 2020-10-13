import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { Team } from '../_models/team.model';

export enum TeamActionTypes {
	AllTeamsRequested = '[Teams Module] All Teams Requested',
	AllTeamsLoaded = '[Teams API] All Teams Loaded',
	TeamOnServerCreated = '[Edit Team Component] Team On Server Created',
	TeamCreated = '[Edit Team Dialog] Team Created',
	TeamUpdated = '[Edit Team Dialog] Team Updated',
	TeamDeleted = '[Teams List Page] Team Deleted',
	TeamsPageRequested = '[Teams List Page] Teams Page Requested',
	TeamsPageLoaded = '[Teams API] Teams Page Loaded',
	TeamsPageCancelled = '[Teams API] Teams Page Cancelled',
	TeamsPageToggleLoading = '[Teams] Teams Page Toggle Loading',
	TeamsActionToggleLoading = '[Teams] Teams Action Toggle Loading',
	TeamUpdatedResponse = '[Teams] Team Updated Response',
	TeamUserListRequested = '[Teams] Team User List Requested',
	TeamUserListLoaded= '[Teams] Team User List Loaded'
}

export class TeamOnServerCreated implements Action {
	readonly type = TeamActionTypes.TeamOnServerCreated;
	constructor(public payload: { team: Team }) { }
}

export class TeamCreated implements Action {
	readonly type = TeamActionTypes.TeamCreated;
	constructor(public payload: { team: any }) { }
}

export class TeamUpdated implements Action {
	readonly type = TeamActionTypes.TeamUpdated;
	constructor(public payload: {
		partialTeam: Update<Team>,
		team: Team
	}) { }
}

export class TeamUpdatedResponse implements Action {
	readonly type = TeamActionTypes.TeamUpdatedResponse;
	constructor(public payload: { team: any }) { }
}


export class TeamDeleted implements Action {
	readonly type = TeamActionTypes.TeamDeleted;
	constructor(public payload: { id: any }) { }
}

export class TeamsPageRequested implements Action {
	readonly type = TeamActionTypes.TeamsPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class TeamsPageLoaded implements Action {
	readonly type = TeamActionTypes.TeamsPageLoaded;
	constructor(public payload: { teams: Team[], total: number, page: QueryParamsModel }) {
	 }
}

export class TeamsPageCancelled implements Action {
	readonly type = TeamActionTypes.TeamsPageCancelled;
}

export class TeamsPageToggleLoading implements Action {
	readonly type = TeamActionTypes.TeamsPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class TeamsActionToggleLoading implements Action {
	readonly type = TeamActionTypes.TeamsActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class TeamUserListRequested implements Action {
	readonly type = TeamActionTypes.TeamUserListRequested;
	constructor(public payload: { }) { }
}

export class TeamUserListLoaded implements Action {
	readonly type = TeamActionTypes.TeamUserListLoaded;
	constructor(public payload: { teams: any }) {
	 }
}


export type TeamActions = TeamCreated
	| TeamUpdated
	| TeamDeleted
	| TeamOnServerCreated
	| TeamsPageLoaded
	| TeamsPageCancelled
	| TeamsPageToggleLoading
	| TeamsPageRequested
	| TeamUpdatedResponse
	| TeamUserListRequested
	| TeamUserListLoaded
	| TeamsActionToggleLoading;
