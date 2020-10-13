import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';


import { Budget } from '../_models/budget.model';

import { QueryParamsModel } from '../../_base/crud';

export enum BudgetActionTypes {
    BudgetPageToggleLoading = '[Budget] Budget Page Toggle Loading',
    BudgetActionToggleLoading = '[Budget] Budget Action Toggle Loading',
    BudgetPageRequested = '[Budget View Page] Budget Page Requested',
    BudgetPageLoaded = '[Budget Loaded] Budget Page Loaded',
    BudgetOnServerCreated = '[Budget Component] Budget On Server Created',
    BudgetCreated = '[Budget Component] Budget Created',
    BudgetDeleted = '[Budget Component] Budget Deleted',
    BudgetUpdated = '[Budget Component] Budget Updated',
    GetBudgetByPatient = '[Careplan Component] Get Budget By Patient',
    GetBudgetByPatientLoaded = '[Careplan Component] Load Budget By Patient '

}

export class BudgetPageToggleLoading implements Action {
    readonly type = BudgetActionTypes.BudgetPageToggleLoading;
    Budget: any;
    constructor(public payload: { isLoading: boolean }) { }
}


export class BudgetActionToggleLoading implements Action {
    readonly type = BudgetActionTypes.BudgetActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}


export class BudgetOnServerCreated implements Action {
    readonly type = BudgetActionTypes.BudgetOnServerCreated;
    constructor(public payload: { budget: Budget }) {
    }
}

export class BudgetCreated implements Action {
    readonly type = BudgetActionTypes.BudgetCreated;
    constructor(public payload: { budget: any, success: boolean}) { }
}

export class BudgetPageRequested implements Action {
    readonly type = BudgetActionTypes.BudgetPageRequested;
    constructor(public payload: { page: QueryParamsModel, participant_id: any }) {
    }
}

export class BudgetPageLoaded implements Action {
    readonly type = BudgetActionTypes.BudgetPageLoaded;
    constructor(public payload: {
        budget: Budget[], total: number, page: QueryParamsModel
    }) { }
}


export class BudgetDeleted implements Action {
    readonly type = BudgetActionTypes.BudgetDeleted;
    constructor(public payload: { id: number }) { }
}

export class BudgetUpdated implements Action {
    readonly type = BudgetActionTypes.BudgetUpdated;
    constructor(public payload: {
        updateBudget: Array<any>
    }) { }
}

export class GetBudgetByPatient implements Action {
    readonly type = BudgetActionTypes.GetBudgetByPatient;
    constructor(public payload: {participant_id: any }) {
    }
}

export class GetBudgetByPatientLoaded implements Action {
    readonly type = BudgetActionTypes.GetBudgetByPatientLoaded;
    constructor(public payload: {
        budget: any, total: number
    }) { }
}

// export class CustomersStatusUpdated implements Action {
//     readonly type = CustomerActionTypes.CustomersStatusUpdated;
//     constructor(public payload: {
//         customers: CustomerModel[],
//         status: number
//     }) { }
// }


export type BudgetActions =
    | BudgetPageToggleLoading
    | BudgetActionToggleLoading
    | BudgetPageRequested
    | BudgetOnServerCreated
    | BudgetCreated
    | BudgetDeleted
    | BudgetUpdated
    | GetBudgetByPatient
    | GetBudgetByPatientLoaded
    | BudgetPageLoaded;





