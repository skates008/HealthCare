import { Injectable } from '@angular/core';

import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	TeamActionTypes,
	TeamsPageRequested,
	TeamsPageLoaded,
	TeamCreated,
	TeamDeleted,
	TeamUpdated,
	TeamOnServerCreated,
	TeamsActionToggleLoading,
	TeamsPageToggleLoading,
	TeamUserListRequested,
	TeamUpdatedResponse,
	TeamUserListLoaded
} from '../_actions/team.actions';
import { TeamService } from '../../../core/_services';

@Injectable()
export class TeamEffects {
	showPageLoadingDispatcher = new TeamsPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new TeamsPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new TeamsActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new TeamsActionToggleLoading({ isLoading: false });

	@Effect()
	loadTeamsPage$ = this.actions$
		.pipe(
			ofType<TeamsPageRequested>(TeamActionTypes.TeamsPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findTeam(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: any = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new TeamsPageLoaded({
					teams: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	updateTeam$ = this.actions$
		.pipe(
			ofType<TeamUpdated>(TeamActionTypes.TeamUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.updateTeam(payload.team).pipe(
					tap(res =>{
						this.store.dispatch(new TeamUpdatedResponse({ team: res }))
					})
				)
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	createTeam$ = this.actions$
		.pipe(
			ofType<TeamOnServerCreated>(TeamActionTypes.TeamOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.createTeam(payload.team).pipe(
					tap(res => {
						this.store.dispatch(new TeamCreated({ team: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);


	@Effect()
	deleteTeam$ = this.actions$
		.pipe(
			ofType<TeamDeleted>(TeamActionTypes.TeamDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.deleteTeam(payload.id);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

		@Effect()
		TeamUserList$ = this.actions$
			.pipe(
				ofType<TeamUserListRequested>(TeamActionTypes.TeamUserListRequested),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDispatcher);
					return this.auth.listTeamUsers().pipe(
						tap(res => {
							this.store.dispatch(new TeamUserListLoaded({ teams: res.data }))

							// this.store.dispatch(new TeamCreated({ team: res }));
						})
					);
				}),
				map(() => {
					return this.hideActionLoadingDispatcher;
				}),
			);

	constructor(private actions$: Actions, private auth: TeamService, private store: Store<AppState>) { }

}
