import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';


import { Setting } from '../_models/settings.model';

import { QueryParamsModel } from '../../_base/crud';

export enum SettingActionTypes {
    SettingPageToggleLoading = '[Setting] Setting Page Toggle Loading',
    SettingActionToggleLoading = '[Setting] Setting Action Toggle Loading',
    SettingPageRequested = '[Setting View Page] Setting Page Requested',
    SettingPageLoaded = '[Setting Loaded] Setting Page Loaded',
    SettingOnServerCreated = '[Setting Component] Setting On Server Created',
    SettingCreated = '[Setting Component] Setting Created',
    SettingUpdated = '[Setting Component] Setting Updated',
    SettingDeleted = '[Setting Component] Setting Deleted',
}

export class SettingPageToggleLoading implements Action {
    readonly type = SettingActionTypes.SettingPageToggleLoading;
    setting: any;
    constructor(public payload: { isLoading: boolean }) { }
}


export class SettingActionToggleLoading implements Action {
    readonly type = SettingActionTypes.SettingActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}


export class SettingOnServerCreated implements Action {
    readonly type = SettingActionTypes.SettingOnServerCreated;
    constructor(public payload: { setting: Setting }) {
    }
}

export class SettingCreated implements Action {
    readonly type = SettingActionTypes.SettingCreated;
    constructor(public payload: { setting: Setting }) { }
}

export class SettingPageRequested implements Action {
    readonly type = SettingActionTypes.SettingPageRequested;
    constructor(public payload: { page: QueryParamsModel, user_id: number }) {
    }
}

export class SettingPageLoaded implements Action {
    readonly type = SettingActionTypes.SettingPageLoaded;
    constructor(public payload: {
        settings: Setting[], total: number, page: QueryParamsModel
    }) { }
}

export class SettingUpdated implements Action {
    readonly type = SettingActionTypes.SettingUpdated;
    constructor(public payload: {
        partialSetting: Update<Setting>,
        setting: Setting
    }) { }
}

export class SettingDeleted implements Action {
    readonly type = SettingActionTypes.SettingDeleted;
    constructor(public payload: { id: number }) { }
}

export type SettingActions =
    | SettingPageToggleLoading
    | SettingActionToggleLoading
    | SettingPageRequested
    | SettingOnServerCreated
    | SettingCreated
    | SettingDeleted
    | SettingUpdated
    | SettingPageLoaded;




