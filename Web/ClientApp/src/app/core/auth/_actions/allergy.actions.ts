import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';


import { Allergy } from '../_models/allergy.model';

import { QueryParamsModel } from '../../_base/crud';

export enum AllergyActionTypes {
    AllergyPageToggleLoading = '[Allergy] Allergy Page Toggle Loading',
    AllergyActionToggleLoading = '[Allergy] Allergy Action Toggle Loading',
    AllergyPageRequested = '[Allergy View Page] Allergy Page Requested',
    AllergyPageLoaded = '[Allergy Loaded] Allergy Page Loaded',
    AllergyOnServerCreated = '[Allergy Component] Allergy On Server Created',
    AllergyCreated = '[Allergy Component] Allergy Created',
    AllergyDeleted = '[Allergy Component] Allergy Deleted',
    
}

export class AllergyPageToggleLoading implements Action {
    readonly type = AllergyActionTypes.AllergyPageToggleLoading;
    allergy: any;
    constructor(public payload: { isLoading: boolean }) { }
}


export class AllergyActionToggleLoading implements Action {
    readonly type = AllergyActionTypes.AllergyActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}


export class AllergyOnServerCreated implements Action {
    readonly type = AllergyActionTypes.AllergyOnServerCreated;
    constructor(public payload: { allergy: Allergy }) {
    }
}

export class AllergyCreated implements Action {
    readonly type = AllergyActionTypes.AllergyCreated;
    constructor(public payload: { allergy: any }) { }
}

export class AllergyPageRequested implements Action {
    readonly type = AllergyActionTypes.AllergyPageRequested;
    constructor(public payload: { page: QueryParamsModel, participant_id: any }) {
    }
}

export class AllergyPageLoaded implements Action {
    readonly type = AllergyActionTypes.AllergyPageLoaded;
    constructor(public payload: {
        allergies: Allergy[], total: number, page: QueryParamsModel
    }) { }
}


export class AllergyDeleted implements Action {
    readonly type = AllergyActionTypes.AllergyDeleted;
    constructor(public payload: { id: number }) { }
}

export type AllergyActions =
    | AllergyPageToggleLoading
    | AllergyActionToggleLoading
    | AllergyPageRequested
    | AllergyOnServerCreated
    | AllergyCreated
    | AllergyDeleted
    | AllergyPageLoaded;





