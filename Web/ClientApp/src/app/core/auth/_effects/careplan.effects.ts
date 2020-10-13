import { Injectable } from '@angular/core';

import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	CareplanActionTypes,
	CareplansPageRequested,
	CareplansPageLoaded,
	CareplanCreated,
	CareplanDeleted,
	CareplanUpdated,
	CareplanOnServerCreated,
	CareplansActionToggleLoading,
	CareplansPageToggleLoading,
	GenerateSummaryPlan,
	getCareplanDetails,
	CareplanDetailsLoaded,
	CarePlanEditPageRequested,
	CareplansEditPageLoaded,
	CareplanListLoadedForTimeEntry,
	CareplanListRequestedForTimeEntry
} from '../_actions/careplan.actions';
import { CareplanService } from '../../../core/_services';

@Injectable()
export class CareplanEffects {
	showPageLoadingDispatcher = new CareplansPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new CareplansPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new CareplansActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new CareplansActionToggleLoading({ isLoading: false });

	@Effect()
	loadCareplansPage$ = this.actions$
		.pipe(
			ofType<CareplansPageRequested>(CareplanActionTypes.CareplansPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findCareplan(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: any = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new CareplansPageLoaded({
					careplans: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	updateCareplan$ = this.actions$
		.pipe(
			ofType<CareplanUpdated>(CareplanActionTypes.CareplanUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.updateCareplan(payload.careplan);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	createCareplan$ = this.actions$
		.pipe(
			ofType<CareplanOnServerCreated>(CareplanActionTypes.CareplanOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.createCareplan(payload.careplan)
			}),
			map(response => {
				const result: any = response;
				const lastQuery: QueryParamsModel = response[1];
				this.store.dispatch(this.showPageLoadingDispatcher);
				return new CareplanCreated({
						careplan: result.data,
						success: result.success
				});
			}),
		);


		@Effect()
		deleteCareplan$ = this.actions$
			.pipe(
				ofType<CareplanDeleted>(CareplanActionTypes.CareplanDeleted),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDispatcher);
					return this.auth.deleteCareplan(payload.id);
				}),
				map(() => {
					return this.hideActionLoadingDispatcher;
				}),
			);

			@Effect()
			generateSummaryPlan$ = this.actions$
				.pipe(
					ofType<GenerateSummaryPlan>(CareplanActionTypes.GenerateSummaryPlan),
					tap(({ payload }) => {
						this.store.dispatch(this.showActionLoadingDispatcher);
						return this.auth.generateSummaryPlan(payload.Careplan);
					}),
					map(() => {
						return this.hideActionLoadingDispatcher;
					}),
				);

				@Effect()
				getCareplanById$ = this.actions$
					.pipe(
						ofType<getCareplanDetails>(CareplanActionTypes.getCareplanDetails),
						tap(({ payload }) => {
							this.store.dispatch(this.showActionLoadingDispatcher);
							return this.auth.getCareplanDetails(payload.Careplan);
						}),
						map(() => {
							return this.hideActionLoadingDispatcher;
						}),
					);


					@Effect()
					getCareplan$ = this.actions$
						.pipe(
							ofType<getCareplanDetails>(CareplanActionTypes.getCareplanDetails),
							mergeMap(({ payload }) => {
								this.store.dispatch(this.showPageLoadingDispatcher);
								return this.auth.getCareplanDetails(payload.Careplan);
								// const lastQuery = of(payload.page);
								// return forkJoin(requestToServer, lastQuery);
							}),
							map(response => {
								const result: any = response;
								const lastQuery: QueryParamsModel = response[1];
								this.store.dispatch(this.showPageLoadingDispatcher);
								return new CareplanDetailsLoaded({
										careplans: result.data,
										page: lastQuery
								});
							}),
						);


						@Effect()
						loadCareplanEditPage$ = this.actions$
							.pipe(
								ofType<CarePlanEditPageRequested>(CareplanActionTypes.CarePlanEditPageRequested),
								mergeMap(({ payload }) => {
									this.store.dispatch(this.showPageLoadingDispatcher);
									const requestToServer = this.auth.findEditPageCareplans(payload.Careplan);
									return forkJoin(requestToServer);
								}),
								map(response => {
									const result: any = response[0];
									return new CareplansEditPageLoaded({
										careplans: result.data,
										total: result.total,
									});
								}),
							);
							@Effect()
							loadCareplansListForTime$ = this.actions$
								.pipe(
									ofType<CareplanListRequestedForTimeEntry>(CareplanActionTypes.CareplanListRequestedForTimeEntry),
									mergeMap(({ payload }) => {
										this.store.dispatch(this.showPageLoadingDispatcher);
										const requestToServer = this.auth.findCareplansForTimeEntry(payload);
										return forkJoin(requestToServer);
									}),
									map(response => {
										const result: any = response[0];
										return new CareplanListLoadedForTimeEntry({
											careplans: result,
											total: result.length,
										});
									}),
								);


	constructor(private actions$: Actions, private auth: CareplanService, private store: Store<AppState>) { }

}
