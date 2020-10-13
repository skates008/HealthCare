import { Injectable } from '@angular/core';

import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	TherapyServiceActionTypes,
	TherapyServicesPageRequested,
	TherapyServicesPageLoaded,
	TherapyServiceCreated,
	TherapyServiceDeleted,
	TherapyServiceUpdated,
	TherapyServiceOnServerCreated,
	TherapyServicesActionToggleLoading,
	TherapyServicesPageToggleLoading
} from '../_actions/therapyService.actions';
import { TherapyServicesService } from '../../../core/_services';

@Injectable()
export class TherapyServiceEffects {
	showPageLoadingDispatcher = new TherapyServicesPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new TherapyServicesPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new TherapyServicesActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new TherapyServicesActionToggleLoading({ isLoading: false });

	@Effect()
	loadTherapyServicesPage$ = this.actions$
		.pipe(
			ofType<TherapyServicesPageRequested>(TherapyServiceActionTypes.TherapyServicesPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findTherapyServices(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: QueryResultsModel = response[0];
				const lastQuery: QueryParamsModel = response[1];
				return new TherapyServicesPageLoaded({
					therapyServices: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteTherapyService$ = this.actions$
		.pipe(
			ofType<TherapyServiceUpdated>(TherapyServiceActionTypes.TherapyServiceUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.updateTherapyService(payload.therapyService);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	createTherapyService$ = this.actions$
		.pipe(
			ofType<TherapyServiceOnServerCreated>(TherapyServiceActionTypes.TherapyServiceOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.createTherapyService(payload.therapyService).pipe(
					tap(res => {
						this.store.dispatch(new TherapyServiceCreated({ therapyService: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	constructor(private actions$: Actions, private auth: TherapyServicesService, private store: Store<AppState>) { }

}
