import { Injectable } from '@angular/core';

import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	TimeActionTypes,
	TimesPageRequested,
	TimesPageLoaded,
	TimeCreated,
	TimeDeleted,
	TimeUpdated,
	TimeOnServerCreated,
	TimesActionToggleLoading,
	TimesPageToggleLoading,
	TimeEntryDetailsByID,
	TimeEntryDetailsByIdLoaded,
	TimeUpdatedLoaded,
	StatementPageRequested,
	StatementPageLoaded,
	StatementViewPageRequested,
	StatementViewPageLoaded
} from '../_actions/time.actions';
import { TimeService } from '../../../core/_services';

@Injectable()
export class TimeEffects {
	showPageLoadingDispatcher = new TimesPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new TimesPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new TimesActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new TimesActionToggleLoading({ isLoading: false });

	@Effect()
	loadTimesPage$ = this.actions$
		.pipe(
			ofType<TimesPageRequested>(TimeActionTypes.TimesPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findTime(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];
				return new TimesPageLoaded({
					times: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	updateTime$ = this.actions$
		.pipe(
			ofType<TimeUpdated>(TimeActionTypes.TimeUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				const requestToServer = this.auth.updateTime(payload.time);
				return forkJoin(requestToServer);
			}),
			map(response => {
				const result = response[0];
				return new TimeUpdatedLoaded({
					time: result.data,
					success: result.success
				});
			}),

		);

	@Effect()
	createTime$ = this.actions$
		.pipe(
			ofType<TimeOnServerCreated>(TimeActionTypes.TimeOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				const requestToServer = this.auth.createTime(payload.time);
				return forkJoin(requestToServer);
			}),
			map(response => {
				const result = response[0];
				return new TimeCreated({
					time: result.data,
					success: result.success
				});
			}),

		);

		@Effect()
		deleteTime$ = this.actions$
			.pipe(
				ofType<TimeDeleted>(TimeActionTypes.TimeDeleted),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDispatcher);
					return this.auth.deleteTime(payload.id);
				}),
				map(() => {
					return this.hideActionLoadingDispatcher;
				}),
			);


		@Effect()
		loadTimesDetailsById$ = this.actions$
		.pipe(
			ofType<TimeEntryDetailsByID>(TimeActionTypes.TimeEntryDetailsByID),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findTimesDetails(payload.timeEntryId);
				return forkJoin(requestToServer);
			}),
			map(response => {
				const result = response[0];
				return new TimeEntryDetailsByIdLoaded({
					times: result.data,
					total: result.total,
					success: result.success
				});
			}),
		);


	@Effect()
	statementPageRequested$ = this.actions$
		.pipe(
			ofType<StatementPageRequested>(TimeActionTypes.StatementPageRequested),
			mergeMap(( ) => {
				const requestToServer = this.auth.findStatementsPage();
				this.store.dispatch(this.showPageLoadingDispatcher);
				return forkJoin(requestToServer);
			}),
			map(response => {
				const result = response[0];
				return new StatementPageLoaded({
					times: result.data,
					total: result.total,
					success: result.success
				});
			}),
		);

		@Effect()
		statementViewPageRequested$ = this.actions$
			.pipe(
				ofType<StatementViewPageRequested>(TimeActionTypes.StatementViewPageRequested),
				mergeMap(({payload} ) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.auth.findStatementsViewPage(payload.StatementId);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					return new StatementViewPageLoaded({
						times: result.data,
						total: result.total,
						success: result.success
					});
				}),
			);



	constructor(private actions$: Actions, private auth: TimeService, private store: Store<AppState>) { }

}
