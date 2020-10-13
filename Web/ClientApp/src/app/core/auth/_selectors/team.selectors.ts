import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { TeamsState } from '../_reducers/team.reducers';

import { each } from 'lodash';
import { Team } from '../_models/team.model';
import { query } from '@angular/animations';

export const selectTeamsState = createFeatureSelector<TeamsState>('Team');

export const selectTeamById = (TeamId: number) => createSelector(
	selectTeamsState,
	TeamsState => TeamsState.entities[TeamId]
);


export const selectTeamsPageLoading = createSelector(
	selectTeamsState,
	TeamsState => {
		return TeamsState.listLoading;
	}
);

export const selectTeamsActionLoading = createSelector(
	selectTeamsState,
	TeamsState => TeamsState.actionsLoading
);

export const selectLastCreatedTeamId = createSelector(
	selectTeamsState,
	TeamsState => TeamsState.lastCreatedTeamId
);

export const selectTeamCreatedSuccess = createSelector(
	selectTeamsState,
	TeamsState => TeamsState.success
);

export const selectTeamsPageLastQuery = createSelector(
	selectTeamsState,
	TeamsState => TeamsState.lastQuery
);

export const selectTeamsInStore = createSelector(
	selectTeamsState,
	TeamsState => {
		const items: Team[] = [];
		each(TeamsState.entities, element => {
			items.push(element);
		});
		const httpExtension = new HttpExtenstionsModel();
		const result: Team[] = httpExtension.sortArray(items, TeamsState.lastQuery.sortField, TeamsState.lastQuery.sortOrder);
		return new QueryResultsModel(result, TeamsState.total, '');
	}
);

export const selectTeamsShowInitWaitingMessage = createSelector(
	selectTeamsState,
	TeamsState => TeamsState.showInitWaitingMessage
);

export const selectHasTeamsInStore = createSelector(
	selectTeamsState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);
