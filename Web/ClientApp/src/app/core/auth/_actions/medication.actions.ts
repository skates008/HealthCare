import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';


import { Medication } from '../_models/medication.model';

import { QueryParamsModel } from '../../_base/crud';

export enum MedicationActionTypes {
    MedicationPageToggleLoading = '[Medication] Medication Page Toggle Loading',
    MedicationActionToggleLoading = '[Medication] Medication Action Toggle Loading',
    MedicationPageRequested = '[Medication View Page] Medication Page Requested',
    MedicationPageLoaded = '[Medication Loaded] Medication Page Loaded',
    MedicationOnServerCreated = '[Medication Component] Medication On Server Created',
    MedicationCreated = '[Medication Component] Medication Created',
    MedicationDeleted = '[Medication Component] Medication Deleted',
}

export class MedicationPageToggleLoading implements Action {
    readonly type = MedicationActionTypes.MedicationPageToggleLoading;
    medication: any;
    constructor(public payload: { isLoading: boolean }) { }
}


export class MedicationActionToggleLoading implements Action {
    readonly type = MedicationActionTypes.MedicationActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}


export class MedicationOnServerCreated implements Action {
    readonly type = MedicationActionTypes.MedicationOnServerCreated;
    constructor(public payload: { medication: Medication }) {
    }
}

export class MedicationCreated implements Action {
    readonly type = MedicationActionTypes.MedicationCreated;
    constructor(public payload: { medication: any }) { }
}



export class MedicationsPageRequested implements Action {
    readonly type = MedicationActionTypes.MedicationPageRequested;
    constructor(public payload: { page: QueryParamsModel, participant_id: any }) {
    }
}

export class MedicationsPageLoaded implements Action {
    readonly type = MedicationActionTypes.MedicationPageLoaded;
    constructor(public payload: {
        medications: Medication[], total: number, page: QueryParamsModel
    }) { }
}


export class MedicationDeleted implements Action {
    readonly type = MedicationActionTypes.MedicationDeleted;
    constructor(public payload: { id: number }) { }
}

export type MedicationActions =
    | MedicationPageToggleLoading
    | MedicationActionToggleLoading
    | MedicationsPageRequested
    | MedicationOnServerCreated
    | MedicationCreated
    | MedicationDeleted
    | MedicationsPageLoaded;





