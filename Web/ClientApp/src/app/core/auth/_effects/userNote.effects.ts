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
import { NoteService, UserNoteService } from '../../_services';
// State
import { AppState } from '../../reducers';
import {
	UserNoteActionTypes,
	UserNotePageRequested,
	UserNotePageLoaded,
	UserNoteCreated,
	UserNoteDeleted,
	UserNoteFileDeleted,
	UserNoteUpdated,
	UserNoteOnServerCreated,
	UserNoteActionToggleLoading,
	UserNotePageToggleLoading,
	GetUserNoteDetailsById,
	GetUserNoteDetailsByIdLoaded,
	UserNoteUpdatedResponse
} from '../_actions/userNote.actions';

@Injectable()
export class UserNoteEffects {
	showPageLoadingDistpatcher = new UserNotePageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new UserNotePageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new UserNoteActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new UserNoteActionToggleLoading({ isLoading: false });

	@Effect()
	loadUserNotePage$ = this.actions$
		.pipe(
			ofType<UserNotePageRequested>(UserNoteActionTypes.UserNotePageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.service.findUserNote(payload.page , payload.participantId);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new UserNotePageLoaded({
					userNote: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteUserNote$ = this.actions$
		.pipe(
			ofType<UserNoteDeleted>(UserNoteActionTypes.UserNoteDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.service.deleteUserNote(payload.userNote);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

		@Effect()
		deleteFileUserNote$ = this.actions$
			.pipe(
				ofType<UserNoteFileDeleted>(UserNoteActionTypes.UserNoteFileDeleted),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDistpatcher);
					return this.service.deleteFile(payload.id);
				}
				),
				map(() => {
					return this.hideActionLoadingDistpatcher;
				}),
			);

	@Effect()
	updateUserNote$ = this.actions$
		.pipe(
			ofType<UserNoteUpdated>(UserNoteActionTypes.UserNoteUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				const requestToServer = this.service.updateUserNote(payload.userNote, '', '');
				return forkJoin(requestToServer);
			}),
			map((response) => {
				const result = response[0];
				return new UserNoteUpdatedResponse({
					userNote: result.data,
					success: result.success
				});
			}),
		);

	@Effect()
	createUserNote$ = this.actions$
		.pipe(
			ofType<UserNoteOnServerCreated>(UserNoteActionTypes.UserNoteOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.service.createUserNote(payload.userNote, payload.id).pipe(
					tap(res => {
						this.store.dispatch(new UserNoteCreated({ userNote: res }));
					})
				);
			}),
			map((response) => {
				const result = response[0];
				return new UserNoteUpdatedResponse({
					userNote: result.data,
					success: result.success
				});
			}),
		);

		@Effect()
		loadUserNoteByIdPage$ = this.actions$
			.pipe(
				ofType<GetUserNoteDetailsById>(UserNoteActionTypes.GetUserNoteDetailsById),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDistpatcher);
					const requestToServer = this.service.getUserNoteById(payload.userNoteId, '');
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					return new GetUserNoteDetailsByIdLoaded({
						userNote: result.data,
						total: result.total,
						success: result.success
					});
				}),
			);
	constructor(private actions$: Actions, private service: UserNoteService, private store: Store<AppState>) { }
}
