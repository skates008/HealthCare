import { Injectable } from '@angular/core';

import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';



import { AppState } from '../../../core/reducers';

import {
    MedicationActionTypes,
    MedicationPageToggleLoading,
    MedicationActionToggleLoading,
    MedicationsPageRequested,
    MedicationsPageLoaded,
    MedicationOnServerCreated,
    MedicationCreated,
    MedicationDeleted
} from '../_actions/medication.actions';
import { MedicationService } from '../../../core/_services';

@Injectable()
export class MedicationEffects {
    showPageLoadingDispatcher = new MedicationPageToggleLoading({ isLoading: true });
    hidePageLoadingDispatcher = new MedicationPageToggleLoading({ isLoading: false });

    showActionLoadingDispatcher = new MedicationActionToggleLoading({ isLoading: true });
    hideActionLoadingDispatcher = new MedicationActionToggleLoading({ isLoading: false });



    @Effect()
    loadMedicationsPage$ = this.actions$
        .pipe(
            ofType<MedicationsPageRequested>(MedicationActionTypes.MedicationPageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDispatcher);
                const requestToServer = this.auth.findMedications(payload.page, payload.participant_id);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                const result: any = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.showPageLoadingDispatcher);

                return new MedicationsPageLoaded({
                    medications: result.data,
                    total: result.total,
                    page: lastQuery
                });
            }),
        );


    @Effect()
    createMedication$ = this.actions$
        .pipe(
            ofType<MedicationOnServerCreated>(MedicationActionTypes.MedicationOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.createMedication(payload.medication).pipe(
                    tap(res => {
                        this.store.dispatch(new MedicationCreated({ medication: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );

    @Effect()
    deleteMedication$ = this.actions$
        .pipe(
            ofType<MedicationDeleted>(MedicationActionTypes.MedicationDeleted),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.deleteMedication(payload.id);
            }
            ),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );

    constructor(private actions$: Actions, private auth: MedicationService, private store: Store<AppState>) { }

}
