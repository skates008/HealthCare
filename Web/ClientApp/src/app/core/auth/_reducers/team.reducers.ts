import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { TeamActions, TeamActionTypes } from '../_actions/team.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Team } from '../_models/team.model';

export interface TeamsState extends EntityState<Team> {
	listLoading: boolean;
	actionsLoading: boolean;
	queryRowsCount: number;
	total: number;
	lastCreatedTeamId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<Team> = createEntityAdapter<Team>();

export const initialTeamsState: TeamsState = adapter.getInitialState({
	listLoading: false,
	actionsLoading: false,
	queryRowsCount: 0,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedTeamId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function teamsReducer(state = initialTeamsState, action: TeamActions): TeamsState {
	switch (action.type) {
		case TeamActionTypes.TeamsPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedTeamId: undefined
		};
		case TeamActionTypes.TeamsActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case TeamActionTypes.TeamOnServerCreated: return {
			...state
		};
		case TeamActionTypes.TeamCreated: return adapter.addOne(action.payload.team, {
			...state,
			success: action.payload.team.success
		});
		case TeamActionTypes.TeamUpdated: return adapter.updateOne(action.payload.partialTeam, state);
		case TeamActionTypes.TeamUpdatedResponse: return adapter.addOne(action.payload.team, {
			...state,
			success: action.payload.team.success
		});
		case TeamActionTypes.TeamDeleted: return adapter.removeOne(action.payload.id, state);
		case TeamActionTypes.TeamsPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case TeamActionTypes.TeamsPageLoaded: {
			return adapter.addMany(action.payload.teams, {
				...initialTeamsState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}

		case TeamActionTypes.TeamUserListLoaded: {
			return adapter.addMany(action.payload.teams, {
				...initialTeamsState,
			});
		}

		default: return state;
	}
}

export const getUserState = createFeatureSelector<TeamsState>('team');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


