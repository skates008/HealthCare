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
import { UserFileService } from '../../_services';
// State
import { AppState } from '../../reducers';
import {
	FileActionTypes,
	FilePageRequested,
	FilePageLoaded,
	FileCreated,
	FileDeleted,
	FileDownload,
	FileUpdated,
	FileOnServerCreated,
	FileActionToggleLoading,
	FilePageToggleLoading,
	GetFileDetailsById,
	GetFileDetailsByIdLoaded,
	FileUpdatedResponse
} from '../_actions/file.actions';

@Injectable()
export class FileEffects {
	showPageLoadingDistpatcher = new FilePageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new FilePageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new FileActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new FileActionToggleLoading({ isLoading: false });

	@Effect()
	loadFilePage$ = this.actions$
		.pipe(
			ofType<FilePageRequested>(FileActionTypes.FilePageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.service.findFile(payload.page , payload.participantId);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new FilePageLoaded({
					file: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteFile$ = this.actions$
		.pipe(
			ofType<FileDeleted>(FileActionTypes.FileDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.service.deleteFile(payload.file);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

		@Effect()
		downloadFile$ = this.actions$
			.pipe(
				ofType<FileDownload>(FileActionTypes.FileDownload),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDistpatcher);
					return this.service.downloadFile(payload.id);
				}
				),
				map(() => {
					return this.hideActionLoadingDistpatcher;
				}),
			);

	@Effect()
	updateFile$ = this.actions$
		.pipe(
			ofType<FileUpdated>(FileActionTypes.FileUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				const requestToServer = this.service.updateFile(payload.file, '', '');
				return forkJoin(requestToServer);
			}),
			map((response) => {
				const result = response[0];
				return new FileUpdatedResponse({
					file: result.data,
					success: result.success
				});
			}),
		);

	@Effect()
	createFile$ = this.actions$
		.pipe(
			ofType<FileOnServerCreated>(FileActionTypes.FileOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.service.createFile(payload.file, payload.id).pipe(
					tap(res => {
						this.store.dispatch(new FileCreated({ file: res }));
					})
				);
			}),
			map((response) => {
				const result = response[0];
				return new FileUpdatedResponse({
					file: result.data,
					success: result.success
				});
			}),
		);

		@Effect()
		loadFileByIdPage$ = this.actions$
			.pipe(
				ofType<GetFileDetailsById>(FileActionTypes.GetFileDetailsById),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDistpatcher);
					const requestToServer = this.service.getFileById(payload.fileId, '');
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					return new GetFileDetailsByIdLoaded({
						file: result.data,
						total: result.total,
						success: result.success
					});
				}),
			);
	constructor(private actions$: Actions, private service: UserFileService, private store: Store<AppState>) { }
}
