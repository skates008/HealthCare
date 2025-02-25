// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { UserService } from '../../../core/_services';
// State
import { AppState } from '../../../core/reducers';
import {
	UserActionTypes,
	UsersPageRequested,
	UsersPageLoaded,
	UserCreated,
	UserDeleted,
	UserUpdated,
	UserOnServerCreated,
	UsersActionToggleLoading,
	UsersPageToggleLoading,
	GetUserDetailsById,
	GetUserDetailsByIdLoaded,
	UserUpdatedResponse
} from '../_actions/user.actions';

@Injectable()
export class UserEffects {
	showPageLoadingDistpatcher = new UsersPageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new UsersPageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new UsersActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new UsersActionToggleLoading({ isLoading: false });

	@Effect()
	loadUsersPage$ = this.actions$
		.pipe(
			ofType<UsersPageRequested>(UserActionTypes.UsersPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.auth.findUser(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new UsersPageLoaded({
					users: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteUser$ = this.actions$
		.pipe(
			ofType<UserDeleted>(UserActionTypes.UserDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.deleteUser(payload.id);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	updateUser$ = this.actions$
		.pipe(
			ofType<UserUpdated>(UserActionTypes.UserUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.updateUser(payload.user).pipe(
					tap(res => {
						this.store.dispatch(new UserUpdatedResponse({ user: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	createUser$ = this.actions$
		.pipe(
			ofType<UserOnServerCreated>(UserActionTypes.UserOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.createUser(payload.user).pipe(
					tap(res => {
						this.store.dispatch(new UserCreated({ user: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

		@Effect()
		loadUsersByIdPage$ = this.actions$
			.pipe(
				ofType<GetUserDetailsById>(UserActionTypes.GetUserDetailsById),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDistpatcher);
					const requestToServer = this.auth.getUserById(payload.userId);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					return new GetUserDetailsByIdLoaded({
						users: result.data,
					});
				}),
			);
	constructor(private actions$: Actions, private auth: UserService, private store: Store<AppState>) { }
}
