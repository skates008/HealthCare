import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';


import { Notification } from '../_models/notification.model';

import { QueryParamsModel } from '../../_base/crud';

export enum NotificationActionTypes {
    NotificationPageToggleLoading = '[Notification]Notification Page Toggle Loading',
    NotificationActionToggleLoading = '[Notification]Notification Action Toggle Loading',
    NotificationPageRequested = '[Notification View Page]Notification Page Requested',
    NotificationPageRequestedByParticipant = '[Notification View Page]Notification Page Requested By Participant',
    NotificationPageLoaded = '[Notification Loaded]Notification Page Loaded',
    NotificationOnServerCreated = '[Notification Component]Notification On Server Created',
    NotificationCreated = '[Notification Component]Notification Created',
    NotificationDeleted = '[Notification Component]Notification Deleted',
}

export class NotificationPageToggleLoading implements Action {
    readonly type = NotificationActionTypes.NotificationPageToggleLoading;
    notification: any;
    constructor(public payload: { isLoading: boolean }) { }
}


export class NotificationActionToggleLoading implements Action {
    readonly type = NotificationActionTypes.NotificationActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}


export class NotificationOnServerCreated implements Action {
    readonly type = NotificationActionTypes.NotificationOnServerCreated;
    constructor(public payload: { notification: Notification }) {
    }
}

export class NotificationCreated implements Action {
    readonly type = NotificationActionTypes.NotificationCreated;
    constructor(public payload: { notification: Notification }) { }
}

export class NotificationPageRequested implements Action {
    readonly type = NotificationActionTypes.NotificationPageRequested;
    constructor(public payload: { page: QueryParamsModel }) {
    }
}

export class NotificationPageRequestedByParticipant implements Action {
    readonly type = NotificationActionTypes.NotificationPageRequested;
    constructor(public payload: { page: QueryParamsModel, participant_id: number }) {
    }
}

export class NotificationPageLoaded implements Action {
    readonly type = NotificationActionTypes.NotificationPageLoaded;
    constructor(public payload: {
        notification: Notification[], total: number, page: QueryParamsModel
    }) { }
}


export class NotificationDeleted implements Action {
    readonly type = NotificationActionTypes.NotificationDeleted;
    constructor(public payload: { id: number }) { }
}

export type NotificationActions =
    | NotificationPageToggleLoading
    | NotificationActionToggleLoading
    | NotificationPageRequested
    | NotificationPageRequestedByParticipant
    | NotificationOnServerCreated
    | NotificationCreated
    | NotificationDeleted
    | NotificationPageLoaded;





