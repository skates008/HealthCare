import { Injectable } from '@angular/core';

import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';



import { AppState } from '../../../core/reducers';

import {
    SettingActionTypes,
    SettingPageToggleLoading,
    SettingActionToggleLoading,
    SettingPageRequested,
    SettingPageLoaded,
    SettingOnServerCreated,
    SettingCreated,
    SettingDeleted,
    SettingUpdated
} from '../_actions/setting.actions';
import { SettingService } from '../../../core/_services';

@Injectable()
export class SettingEffects {
    showPageLoadingDispatcher = new SettingPageToggleLoading({ isLoading: true });
    hidePageLoadingDispatcher = new SettingPageToggleLoading({ isLoading: false });

    showActionLoadingDispatcher = new SettingActionToggleLoading({ isLoading: true });
    hideActionLoadingDispatcher = new SettingActionToggleLoading({ isLoading: false });



    // @Effect()
    // loadSettingPage$ = this.actions$
    //     .pipe(
    //         ofType<SettingPageRequested>(SettingActionTypes.SettingPageRequested),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showPageLoadingDispatcher);
    //             const requestToServer = this.auth.findSettings(payload.page, payload.user_id);
    //             const lastQuery = of(payload.page);
    //             return forkJoin(requestToServer, lastQuery);
    //         }),
    //         map(response => {
    //             const result: QueryResultsModel = response[0];
    //             const lastQuery: QueryParamsModel = response[1];
    //             this.store.dispatch(this.showPageLoadingDispatcher);

    //             return new SettingPageLoaded(
    //                 {
    //                     settings: result.data,
    //                     total: result.total,
    //                     page: lastQuery,
    //                 });
    //         }),
    //     );


    @Effect()
    updateSetting$ = this.actions$
        .pipe(
            ofType<SettingUpdated>(SettingActionTypes.SettingUpdated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.updateSetting(payload.setting);
            }),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );


    // @Effect()
    // createMedication$ = this.actions$
    //     .pipe(
    //         ofType<MedicationOnServerCreated>(MedicationActionTypes.MedicationOnServerCreated),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showActionLoadingDispatcher);
    //             return this.auth.createMedication(payload.medication).pipe(
    //                 tap(res => {
    //                     this.store.dispatch(new MedicationCreated({ medication: res }));
    //                 })
    //             );
    //         }),
    //         map(() => {
    //             return this.hideActionLoadingDispatcher;
    //         }),
    //     );

    // @Effect()
    // createSetting$ = this.actions$
    //     .pipe(
    //         ofType<SettingOnServerCreated>(SettingActionTypes.SettingOnServerCreated),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showActionLoadingDispatcher);
    //             return this.auth.createSetting(payload.setting).pipe(
    //                 tap(res => {
    //                     this.store.dispatch(new SettingCreated({ setting: res }));
    //                 })
    //             );
    //         }),
    //         map(() => {
    //             return this.hideActionLoadingDispatcher;
    //         }),
    //     );

    constructor(private actions$: Actions, private auth: SettingService, private store: Store<AppState>) { }

}
