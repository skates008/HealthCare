import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';


import { Appointment } from '../_models/appointment.model';

import { QueryParamsModel } from '../../_base/crud';

export enum AppointmentActionTypes {
    AppointmentOnServerCreated = '[Appointment Component] Appointment On Server Created',
    AppointmentCreated = '[Appointment Add Component] Appointment Created',
    AppointmentPageToggleLoading = '[Appointment] Appointment Page Toggle Loading',
    AppointmentActionToggleLoading = '[Appointment] Appointment Action Toggle Loading',
    AppointmentsPageRequested = '[Appointment View Page] Appointments Page Requested',
    AppointmentsPageLoaded = '[Appointment Loaded] Appointments Page Loaded',
    AppointmentUpdated = '[Appointment Add Component] Appointments Updated',
    AppointmentDeleted = '[Event Component] Appointment Deleted',
    AppointmentArchived = '[Event Component] Appointment Archived',
    AssessmentAdded = '[Event Component] Assessment Add',
    ObservationAdded = '[Event Component] Observation Add',
    AppointmentCancelled = '[Event Component] Appointment Cancel',
    AppointmentFinalize = '[Event Component] Appointment Finalize',
    UpcomingAppointmentPageRequested = '[Therapist Dashboard Component] Appointment Upcoming Page Requested',
    UpcomingAppointmentPageLoaded= '[Therapist Dashboard] Appointment Upcoming Page Loaded',
    CancelAppointmentResponse = '[Cancel Appointment Response] Cancel Appointment Response',
    FinalizeAppointmentResponse = '[Finalize Appointment Response] Finalize Appointment Response',
    RecentAppointmentListRequested = '[Recent Appointment List] Recent Appointment List',
    RecentAppointmentsListLoaded = '[Recent Appointment Loaded] Recents Appointments List Loaded',
    GridViewAppointmentList = '[GridView Appointment] GridView Appointment List',
    GridViewAppointmentListLoaded = '[GridView Appointment Loaded] GridView Appointment List Loaded'


}

export class AppointmentOnServerCreated implements Action {
    readonly type = AppointmentActionTypes.AppointmentOnServerCreated;
    constructor(public payload: { appointment: Appointment }) {
    }
}

export class AppointmentCreated implements Action {
    readonly type = AppointmentActionTypes.AppointmentCreated;
    constructor(public payload: { appointment: any }) { }
}

export class AppointmentPageToggleLoading implements Action {
    readonly type = AppointmentActionTypes.AppointmentPageToggleLoading;
    appointment: any;
    constructor(public payload: { isLoading: boolean }) { }
}


export class AppointmentActionToggleLoading implements Action {
    readonly type = AppointmentActionTypes.AppointmentActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}


export class AppointmentsPageRequested implements Action {
    readonly type = AppointmentActionTypes.AppointmentsPageRequested;
    constructor(public payload: { page: QueryParamsModel, appointmentParams: any}) { }
}


export class AppointmentsPageLoaded implements Action {
    readonly type = AppointmentActionTypes.AppointmentsPageLoaded;
    constructor(public payload: {
        appointments: any, total: number, page: QueryParamsModel
    }) { }
}

export class AppointmentUpdated implements Action {
    readonly type = AppointmentActionTypes.AppointmentUpdated;
    constructor(public payload: {
        partialappointment: Update<Appointment>,
        appointment: Appointment
    }) { }
}
export class AppointmentDeleted implements Action {
    readonly type = AppointmentActionTypes.AppointmentDeleted;
    constructor(public payload: { id: number }) { }
}

export class AppointmentArchived implements Action {
    readonly type = AppointmentActionTypes.AppointmentArchived;
    constructor(public payload: { appointment: Appointment }) {
    }
}

export class AssessmentAdded implements Action {
    readonly type = AppointmentActionTypes.AssessmentAdded;
    constructor(public payload: { appointment: Appointment }) {
    }
}

export class ObservationAdded implements Action {
    readonly type = AppointmentActionTypes.ObservationAdded;
    constructor(public payload: { appointment: Appointment }) {
    }
}

export class AppointmentCancelled implements Action {
    readonly type = AppointmentActionTypes.AppointmentCancelled;
    constructor(public payload: { id: any, cancelData: any }) { }
}

export class AppointmentFinalize implements Action {
    readonly type = AppointmentActionTypes.AppointmentFinalize;
    constructor(public payload: { id: any, finalizeData: any }) {
     }
}

export class CancelAppointmentResponse implements Action {
    readonly type = AppointmentActionTypes.CancelAppointmentResponse;
    constructor(public payload: { appointment: any }) { }
}

export class FinalizeAppointmentResponse implements Action {
    readonly type = AppointmentActionTypes.FinalizeAppointmentResponse;
    constructor(public payload: { appointment: any }) { }
}


export class UpcomingAppointmentPageRequested implements Action {
    readonly type = AppointmentActionTypes.UpcomingAppointmentPageRequested;
    constructor(public payload: {}) { }
}


export class UpcomingAppointmentPageLoaded implements Action {
    readonly type = AppointmentActionTypes.UpcomingAppointmentPageLoaded;
    constructor(public payload: {
        appointments: any, total: number, success: boolean
    }) { }
}

export class RecentAppointmentListRequested implements Action {
    readonly type = AppointmentActionTypes.RecentAppointmentListRequested;
    constructor(public payload: { page: QueryParamsModel, appointmentParams: any}) { }
}

export class RecentAppointmentsListLoaded implements Action {
    readonly type = AppointmentActionTypes.RecentAppointmentsListLoaded;
    constructor(public payload: {
        appointments: any, total: number, page: QueryParamsModel
    }) { }
}


export class GridViewAppointmentList implements Action {
    readonly type = AppointmentActionTypes.GridViewAppointmentList;
    constructor(public payload: {
        params: any
    }) { }
}


export class GridViewAppointmentListLoaded implements Action {
    readonly type = AppointmentActionTypes.GridViewAppointmentListLoaded;
    constructor(public payload: {
        appointments: any
    }) { }
}







export type AppointmentActions = AppointmentCreated
    | AppointmentOnServerCreated
    | AppointmentCreated
    | AppointmentsPageRequested
    | AppointmentsPageLoaded
    | AppointmentPageToggleLoading
    | AppointmentUpdated
    | AppointmentActionToggleLoading
    | AppointmentDeleted
    | AssessmentAdded
    | ObservationAdded
    | AppointmentArchived
    | AppointmentCancelled
    | AppointmentFinalize
    | UpcomingAppointmentPageRequested
    | FinalizeAppointmentResponse
    | CancelAppointmentResponse
    | RecentAppointmentListRequested
    | RecentAppointmentsListLoaded
    | GridViewAppointmentList
    | GridViewAppointmentListLoaded
    | UpcomingAppointmentPageLoaded;



