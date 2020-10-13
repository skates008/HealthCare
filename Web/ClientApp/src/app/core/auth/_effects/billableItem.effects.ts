import { Injectable } from '@angular/core';

import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	BillableItemActionTypes,
	BillableItemsPageRequested,
	BillableItemsPageLoaded,
	BillableItemCreated,
	BillableItemDeleted,
	BillableItemUpdated,
	BillableItemOnServerCreated,
	BillableItemsActionToggleLoading,
	BillableItemsPageToggleLoading,
	GetBillableItemById,
	GetBillableItemLoadedById,
	BillableItemsUpdatedResponse,
	BillableItemsForTimeRequested,
	BillableItemsForTimeLoadedLoaded
} from '../_actions/billableItem.actions';
import { BillableitemService } from '../../../core/_services';

@Injectable()
export class BillableItemEffects {
	showPageLoadingDispatcher = new BillableItemsPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new BillableItemsPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new BillableItemsActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new BillableItemsActionToggleLoading({ isLoading: false });

	@Effect()
	loadBillableItemsPage$ = this.actions$
		.pipe(
			ofType<BillableItemsPageRequested>(BillableItemActionTypes.BillableItemsPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findBillableItems(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new BillableItemsPageLoaded({
					billableItems: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	updateBillableItem$ = this.actions$
		.pipe(
			ofType<BillableItemUpdated>(BillableItemActionTypes.BillableItemUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				const requestToServer = this.auth.updateBillableItem(payload.billableItem);
				return forkJoin(requestToServer);
			}),
			map(response => {
				const result = response[0];
				return new BillableItemsUpdatedResponse({
					billableItem: result.data,
				});
			}),
		);


		@Effect()
		deleteBillableItem$ = this.actions$
			.pipe(
				ofType<BillableItemDeleted>(BillableItemActionTypes.BillableItemDeleted),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDispatcher);
					const requestToServer = this.auth.deleteBillableItem(payload.id);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					// return new BillableItemsUpdatedResponse({
					// 	billableItem: result.data,
					// });
				}),
			);


	@Effect()
	createBillableItem$ = this.actions$
		.pipe(
			ofType<BillableItemOnServerCreated>(BillableItemActionTypes.BillableItemOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				const requestToServer = this.auth.createBillableItem(payload.billableItem);
				return forkJoin(requestToServer);
			}),
			map((response) => {
				const result = response[0];
				return new BillableItemCreated({
					billableItem: result.data
				});
			}),
		);


		@Effect()
		getBillableItemsPage$ = this.actions$
			.pipe(
				ofType<GetBillableItemById>(BillableItemActionTypes.GetBillableItemById),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.auth.getBillableItemById(payload.id);
					// const lastQuery = of(payload.page);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					// const lastQuery: QueryParamsModel = response[1];
					return new GetBillableItemLoadedById({
						billableItems: result.data,
						total: result.total,
					});
				}),
			);


		@Effect()
		billableItems$ = this.actions$
			.pipe(
				ofType<BillableItemsForTimeRequested>(BillableItemActionTypes.BillableItemsForTimeRequested),
				mergeMap(( ) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.auth.findBillableItemsTimes();
					// const lastQuery = of(payload.page);
					return forkJoin(requestToServer);
				}),
				map(response => {
				const result = response[0];
				return new BillableItemsForTimeLoadedLoaded({
						billableTimeEntries: result,
						total: result.total,
					});
				}),
			);

	constructor(private actions$: Actions, private auth: BillableitemService, private store: Store<AppState>) { }

}
