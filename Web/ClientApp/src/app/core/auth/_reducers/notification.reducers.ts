import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { NotificationActions, NotificationActionTypes } from '../_actions/notification.actions';

import { Notification } from '../_models/notification.model';

export interface NotificationState extends EntityState<Notification> {
    isAllNotificationLoaded: boolean;
    listLoading: boolean;
    actionsLoading: boolean;
    total: number;
    lastCreatedNotificationId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    queryRowsCount: number;
    queryResult: Notification[];
}

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>();

export const initialNotificationState: NotificationState = adapter.getInitialState({
    isAllNotificationLoaded: false,
    listLoading: false,
    actionsLoading: false,
    total: 0,
    lastQuery: new QueryParamsModel({}),
    lastCreatedNotificationId: undefined,
    showInitWaitingMessage: true,
    queryRowsCount: 0,
    queryResult: [],
});

export function notificationReducer(state = initialNotificationState, action: NotificationActions): NotificationState {
    switch (action.type) {
        case NotificationActionTypes.NotificationPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedNotificationId: undefined
        };
        case NotificationActionTypes.NotificationActionToggleLoading: return {
            ...state, actionsLoading: action.payload.isLoading
        };
        case NotificationActionTypes.NotificationPageLoaded: return adapter.addMany(action.payload.notification,
            {
                ...initialNotificationState,
                listLoading: false,
                queryRowsCount: action.payload.total,
                queryResult: action.payload.notification,
                lastQuery: action.payload.page,
                showInitWaitingMessage: false,
            });
        case NotificationActionTypes.NotificationDeleted: return adapter.removeOne(action.payload.id, state);
        case NotificationActionTypes.NotificationOnServerCreated:
            return {
                ...state,
            };
        case NotificationActionTypes.NotificationCreated:
            return adapter.addOne(action.payload.notification,
                {
                    ...state, lastCreatedNotificationId: action.payload.notification.id
                });

        default: return state;
    }
}

export const getNotificationState = createFeatureSelector<NotificationState>('notification');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();


