import { Injectable } from '@angular/core';

import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	ProfileActionTypes,
	ProfilesPageRequested,
	ProfilesPageLoaded,
	ProfileUpdated,
	ProfilesActionToggleLoading,
	ProfilesPageToggleLoading,
	getProfileDetails,
	ProfileDetailsLoaded,
	ProfileEditPageRequested,
	ProfilesEditPageLoaded,
	ProfileUpdatedLoaded
} from '../_actions/profile.actions';

import { AuthService } from '../../../core/_services';

@Injectable()
export class ProfileEffects {
	showPageLoadingDispatcher = new ProfilesPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new ProfilesPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new ProfilesActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new ProfilesActionToggleLoading({ isLoading: false });

	@Effect()
	loadProfilesPage$ = this.actions$
		.pipe(
			ofType<ProfilesPageRequested>(ProfileActionTypes.ProfilesPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findProfile(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: any = response[0];
				const pageLoadedDispatch = new ProfilesPageLoaded({
					profiles: result.data,
					total: result.total,
					success: result.success
				});
				return pageLoadedDispatch;
			}),
		);

	@Effect()
	updateProfile$ = this.actions$
		.pipe(
			ofType<ProfileUpdated>(ProfileActionTypes.ProfileUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.updateProfile(payload.profile);
			}),
			map(response => {
				const result: any = response;
				return new ProfileUpdatedLoaded({
					profile: result.data,
					success: result.success
				});
			}),
		);



	@Effect()
	getProfile$ = this.actions$
		.pipe(
			ofType<getProfileDetails>(ProfileActionTypes.getProfileDetails),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				return this.auth.getProfileDetails();
				// const lastQuery = of(payload.page);
				// return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: any = response;
				const lastQuery: QueryParamsModel = response[1];
				this.store.dispatch(this.showPageLoadingDispatcher);
				return new ProfileDetailsLoaded({
					profiles: result.data,
					page: lastQuery
				});
			}),
		);


	@Effect()
	loadProfileEditPage$ = this.actions$
		.pipe(
			ofType<ProfileEditPageRequested>(ProfileActionTypes.ProfileEditPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.getProfileDetails();
				return forkJoin(requestToServer);
			}),
			map(response => {
				const result: any = response[0];
				return new ProfilesEditPageLoaded({
					profiles: result.data
				});
			}),
		);



	constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }

}
