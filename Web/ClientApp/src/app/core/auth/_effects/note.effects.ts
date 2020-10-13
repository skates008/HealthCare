import { Injectable } from '@angular/core';

import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';



import { AppState } from '../../../core/reducers';

import {
    NoteActionTypes,
    NotePageToggleLoading,
    NoteActionToggleLoading,
    NotePageRequested,
    NotePageLoaded,
    NoteOnServerCreated,
    NoteCreated,
    NoteDeleted,
    NoteUpdated,
    AppointmentNoteOnServerCreated,
    CareplanNoteOnServerCreated,
    AppointmentNoteCreated,
    CareplanNoteCreated
} from '../_actions/note.actions';
import { NoteService } from '../../../core/_services';

@Injectable()
export class NoteEffects {
    showPageLoadingDispatcher = new NotePageToggleLoading({ isLoading: true });
    hidePageLoadingDispatcher = new NotePageToggleLoading({ isLoading: false });

    showActionLoadingDispatcher = new NoteActionToggleLoading({ isLoading: true });
    hideActionLoadingDispatcher = new NoteActionToggleLoading({ isLoading: false });



    @Effect()
    loadNotePage$ = this.actions$
        .pipe(
            ofType<NotePageRequested>(NoteActionTypes.NotePageRequested),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showPageLoadingDispatcher);
                const requestToServer = this.auth.findNote(payload.page, payload.participant_id);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.showPageLoadingDispatcher);

                return new NotePageLoaded(
                    {
                        note: result.data,
                        total: result.total,
                        page: lastQuery,
                    });
            }),
        );


    // @Effect()
    // deleteNote$ = this.actions$
    //     .pipe(
    //         ofType<NoteDeleted>(NoteActionTypes.NoteDeleted),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showActionLoadingDispatcher);
    //             return this.auth.deleteNote(payload.id);
    //         }
    //         ),
    //         map(() => {
    //             return this.hideActionLoadingDispatcher;
    //         }),
    //     );

    @Effect()
    createNote$ = this.actions$
        .pipe(
            ofType<NoteOnServerCreated>(NoteActionTypes.NoteOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.createNote(payload.note).pipe(
                    tap(res => {
                        this.store.dispatch(new NoteCreated({ note: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );

    // @Effect()
    // updateNote$ = this.actions$
    //     .pipe(
    //         ofType<NoteUpdated>(NoteActionTypes.NoteUpdated),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showActionLoadingDispatcher);
    //             return this.auth.updatedNoteAmount(payload.updateNote);
    //         }),
    //         map(() => {
    //             return this.hideActionLoadingDispatcher;
    //         })
    //     );

    @Effect()
    AppointmentNote$ = this.actions$
        .pipe(
            ofType<AppointmentNoteOnServerCreated>(NoteActionTypes.AppointmentNoteOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.createAppointmentNote(payload.note).pipe(
                    tap(res => {
                        this.store.dispatch(new AppointmentNoteCreated({ note: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );

        @Effect()
        CareplanNote$ = this.actions$
            .pipe(
                ofType<CareplanNoteOnServerCreated>(NoteActionTypes.CareplanNoteOnServerCreated),
                mergeMap(({ payload }) => {
                    this.store.dispatch(this.showActionLoadingDispatcher);
                    return this.auth.createCareplanNote(payload.note).pipe(
                        tap(res => {
                            this.store.dispatch(new CareplanNoteCreated({ note: res }));
                        })
                    );
                }),
                map(() => {
                    return this.hideActionLoadingDispatcher;
                }),
            );


    constructor(private actions$: Actions, private auth: NoteService, private store: Store<AppState>) { }

}
