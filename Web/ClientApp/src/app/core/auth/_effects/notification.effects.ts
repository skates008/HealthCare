import { Injectable } from '@angular/core';

import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';



import { AppState } from '../../../core/reducers';

import {
    NotificationActionTypes,
    NotificationPageToggleLoading,
    NotificationActionToggleLoading,
    NotificationPageRequestedByParticipant,
    NotificationPageRequested,
    NotificationPageLoaded,
    NotificationOnServerCreated,
    NotificationCreated,
    NotificationDeleted
} from '../_actions/notification.actions';
import { NotificationService } from '../../../core/_services';

@Injectable()
export class NotificationEffects {
    showPageLoadingDispatcher = new NotificationPageToggleLoading({ isLoading: true });
    hidePageLoadingDispatcher = new NotificationPageToggleLoading({ isLoading: false });

    showActionLoadingDispatcher = new NotificationActionToggleLoading({ isLoading: true });
    hideActionLoadingDispatcher = new NotificationActionToggleLoading({ isLoading: false });



    // @Effect()
    // loadNotificationPageByParticipant$ = this.actions$
    //     .pipe(
    //         ofType<NotificationPageRequestedByParticipant>(NotificationActionTypes.NotificationPageRequestedByParticipant),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showPageLoadingDispatcher);
    //             const requestToServer = this.auth.findNotificationByParticipant(payload.page, payload.participant_id);
    //             const lastQuery = of(payload.page);
    //             return forkJoin(requestToServer, lastQuery);
    //         }),
    //         map(response => {
    //             const result: QueryResultsModel = response[0];
    //             const lastQuery: QueryParamsModel = response[1];
    //             this.store.dispatch(this.showPageLoadingDispatcher);

    //             return new NotificationPageLoaded(
    //                 {
    //                     notification: result.items,
    //                     total: result.total,
    //                     page: lastQuery,
    //                 });
    //         }),
    //     );

    // @Effect()
    // loadNotificationPage$ = this.actions$
    //     .pipe(
    //         ofType<NotificationPageRequested>(NotificationActionTypes.NotificationPageRequested),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showPageLoadingDispatcher);
    //             const requestToServer = this.auth.findNotifications(payload.page);
    //             const lastQuery = of(payload.page);
    //             return forkJoin(requestToServer, lastQuery);
    //         }),
    //         map(response => {
    //             const result: QueryResultsModel = response[0];
    //             const lastQuery: QueryParamsModel = response[1];
    //             this.store.dispatch(this.showPageLoadingDispatcher);

    //             return new NotificationPageLoaded({
    //                 notification: result.items,
    //                 total: result.total,
    //                 page: lastQuery
    //             });
    //         }),
    //     );




    // @Effect()
    // deleteNotification$ = this.actions$
    //     .pipe(
    //         ofType<NotificationDeleted>(NotificationActionTypes.NotificationDeleted),
    //         mergeMap(({ payload }) => {
    //             this.store.dispatch(this.showActionLoadingDispatcher);
    //             return this.auth.deleteNotification(payload.id);
    //         }
    //         ),
    //         map(() => {
    //             return this.hideActionLoadingDispatcher;
    //         }),
    //     );

    @Effect()
    createNotification$ = this.actions$
        .pipe(
            ofType<NotificationOnServerCreated>(NotificationActionTypes.NotificationOnServerCreated),
            mergeMap(({ payload }) => {
                this.store.dispatch(this.showActionLoadingDispatcher);
                return this.auth.createNotification(payload.notification).pipe(
                    tap(res => {
                        this.store.dispatch(new NotificationCreated({ notification: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDispatcher;
            }),
        );
    constructor(private actions$: Actions, private auth: NotificationService, private store: Store<AppState>) { }

}
