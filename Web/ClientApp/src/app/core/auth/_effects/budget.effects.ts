import { Injectable } from '@angular/core';

import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action, resultMemoize } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';



import { AppState } from '../../../core/reducers';

import {
    BudgetActionTypes,
    BudgetPageToggleLoading,
    BudgetActionToggleLoading,
    BudgetPageRequested,
    BudgetPageLoaded,
    BudgetOnServerCreated,
    BudgetCreated,
    BudgetDeleted,
    BudgetUpdated,
    GetBudgetByPatient,
    GetBudgetByPatientLoaded
} from '../_actions/budget.actions';
import { BudgetService } from '../../../core/_services';

@Injectable()
export class BudgetEffects {
    showPageLoadingDispatcher = new BudgetPageToggleLoading({ isLoading: true });
    hidePageLoadingDispatcher = new BudgetPageToggleLoading({ isLoading: false });

    showActionLoadingDispatcher = new BudgetActionToggleLoading({ isLoading: true });
    hideActionLoadingDispatcher = new BudgetActionToggleLoading({ isLoading: false });



    @Effect()
    loadBudgetPage$ = this.actions$
        .pipe(
            ofType<BudgetPageRequested>(BudgetActionTypes.BudgetPageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDispatcher);
                const requestToServer = this.auth.findBudget(payload.page, payload.participant_id);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                const result = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.showPageLoadingDispatcher);
                return new BudgetPageLoaded(
                    {
                        budget: result.data,
                        total: result.total,
                        page: lastQuery,
                    });
            }),
        );


    @Effect()
    getBudgetPageByPatient$ = this.actions$
        .pipe(
            ofType<GetBudgetByPatient>(BudgetActionTypes.GetBudgetByPatient),
            mergeMap(({ payload }) => {
               this.store.dispatch(this.showPageLoadingDispatcher);
                const requestToServer = this.auth.findBudgetByPatient(payload.participant_id);
                // const lastQuery = of(payload.page);
                return forkJoin(requestToServer);
            }),
            map(response => {
                const result = response[0];
                // const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.showPageLoadingDispatcher);
                return new GetBudgetByPatientLoaded(
                    {
                        budget: result,
                        total: result.length,
                    });
            }),
        );



    @Effect()
    deleteBudget$ = this.actions$
        .pipe(
            ofType<BudgetDeleted>(BudgetActionTypes.BudgetDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.deleteBudget(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );

    // @Effect()
    // createBudget$ = this.actions$
    //     .pipe(
    //         ofType<BudgetOnServerCreated>(BudgetActionTypes.BudgetOnServerCreated),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showActionLoadingDispatcher);
    //             return this.auth.createBudget(payload.budget).pipe(
    //                 map(res => {
    //                     this.store.dispatch(new BudgetCreated({ budget: res }));
    //                 })
    //             );
    //         }),
    //         map(response => {
    //             const result = response;
    //             this.store.dispatch(this.showPageLoadingDispatcher);
    //             return new GetBudgetByPatientLoaded(
    //                 {
    //                     budget: result,
    //                 });
    //         }),
    //     );


    @Effect()
    createBudgetPage$ = this.actions$
        .pipe(
            ofType<BudgetOnServerCreated>(BudgetActionTypes.BudgetOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDispatcher);
                const requestToServer = this.auth.createBudget(payload.budget);
                return forkJoin(requestToServer);
            }),
            map(response => {
                const result = response[0];
                this.store.dispatch(this.showPageLoadingDispatcher);
                return new BudgetCreated(
                    {
                        budget: result.data,
                        success: result.success
                    });
            }),
        );

    @Effect()
    updateBudget$ = this.actions$
        .pipe(
            ofType<BudgetUpdated>(BudgetActionTypes.BudgetUpdated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.updatedBudgetAmount(payload.updateBudget);
            }),
            map(() => {
                return this.hideActionLoadingDispatcher;
            })
        );

    constructor(private actions$: Actions, private auth: BudgetService, private store: Store<AppState>) { }

}
