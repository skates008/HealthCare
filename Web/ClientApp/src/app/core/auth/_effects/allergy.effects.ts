import { Injectable } from '@angular/core';

import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';



import { AppState } from '../../../core/reducers';

import {
    AllergyActionTypes,
    AllergyPageToggleLoading,
    AllergyActionToggleLoading,
    AllergyPageRequested,
    AllergyPageLoaded,
    AllergyOnServerCreated,
    AllergyCreated,
    AllergyDeleted
} from '../_actions/allergy.actions';
import { MedicationService } from '../../../core/_services';

@Injectable()
export class AllergyEffects {
    showPageLoadingDispatcher = new AllergyPageToggleLoading({ isLoading: true });
    hidePageLoadingDispatcher = new AllergyPageToggleLoading({ isLoading: false });

    showActionLoadingDispatcher = new AllergyActionToggleLoading({ isLoading: true });
    hideActionLoadingDispatcher = new AllergyActionToggleLoading({ isLoading: false });



    @Effect()
    loadAllergyPage$ = this.actions$
        .pipe(
            ofType<AllergyPageRequested>(AllergyActionTypes.AllergyPageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDispatcher);
                const requestToServer = this.auth.findAllergies(payload.page, payload.participant_id);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                const result = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.showPageLoadingDispatcher);

                return new AllergyPageLoaded(
                    {
                        allergies: result.data,
                        total: result.total,
                        page: lastQuery,
                    });
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

    @Effect()
    deleteAllergy$ = this.actions$
        .pipe(
            ofType<AllergyDeleted>(AllergyActionTypes.AllergyDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.deleteAllergy(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );

    @Effect()
    createAllergy$ = this.actions$
        .pipe(
            ofType<AllergyOnServerCreated>(AllergyActionTypes.AllergyOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.createAllergy(payload.allergy).pipe(
                    tap(res => {
                        this.store.dispatch(new AllergyCreated({ allergy: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );
    constructor(private actions$: Actions, private auth: MedicationService, private store: Store<AppState>) { }

}
