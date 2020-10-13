import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';


import { Note } from '../_models/note.model';

import { QueryParamsModel } from '../../_base/crud';

export enum NoteActionTypes {
    NotePageToggleLoading = '[Note] Note Page Toggle Loading',
    NoteActionToggleLoading = '[Note] Note Action Toggle Loading',
    NotePageRequested = '[Note View Page] Note Page Requested',
    NotePageLoaded = '[Note Loaded] Note Page Loaded',
    NoteOnServerCreated = '[Note Component] Note On Server Created',
    NoteCreated = '[Note Component] Note Created',
    NoteDeleted = '[Note Component] Note Deleted',
    NoteUpdated = '[Note Component] Note Updated',
    AppointmentNoteOnServerCreated = '[Appointment Note Component] Appointment Note On Server Created',
    AppointmentNoteCreated = '[Appointment Note Component] Appointment Note Created',
    CareplanNoteOnServerCreated = '[Careplan Note Component] Careplan Note On Server Created',
    CareplanNoteCreated = '[Careplan Note Component] Careplan Note Created',



}

export class NotePageToggleLoading implements Action {
    readonly type = NoteActionTypes.NotePageToggleLoading;
    Note: any;
    constructor(public payload: { isLoading: boolean }) { }
}


export class NoteActionToggleLoading implements Action {
    readonly type = NoteActionTypes.NoteActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}


export class NoteOnServerCreated implements Action {
    readonly type = NoteActionTypes.NoteOnServerCreated;
    constructor(public payload: { note: Note }) {
    }
}

export class NoteCreated implements Action {
    readonly type = NoteActionTypes.NoteCreated;
    constructor(public payload: { note: Note }) { }
}

export class NotePageRequested implements Action {
    readonly type = NoteActionTypes.NotePageRequested;
    constructor(public payload: { page: QueryParamsModel, participant_id: number }) {
    }
}

export class NotePageLoaded implements Action {
    readonly type = NoteActionTypes.NotePageLoaded;
    constructor(public payload: {
        note: Note[], total: number, page: QueryParamsModel
    }) { }
}

export class AppointmentNoteOnServerCreated implements Action {
    readonly type = NoteActionTypes.AppointmentNoteOnServerCreated;
    constructor(public payload: { note: Note }) {
    }
}

export class AppointmentNoteCreated implements Action {
    readonly type = NoteActionTypes.AppointmentNoteCreated;
    constructor(public payload: { note: Note }) { }
}

export class CareplanNoteOnServerCreated implements Action {
    readonly type = NoteActionTypes.CareplanNoteOnServerCreated;
    constructor(public payload: { note: Note }) {
    }
}

export class CareplanNoteCreated implements Action {
    readonly type = NoteActionTypes.CareplanNoteCreated;
    constructor(public payload: { note: Note }) { }
}

export class NoteDeleted implements Action {
    readonly type = NoteActionTypes.NoteDeleted;
    constructor(public payload: { id: number }) { }
}

export class NoteUpdated implements Action {
    readonly type = NoteActionTypes.NoteUpdated;
    constructor(public payload: {
        updateNote: Array<any>
    }) { }
}

export type NoteActions =
    | NotePageToggleLoading
    | NoteActionToggleLoading
    | NotePageRequested
    | NoteOnServerCreated
    | NoteCreated
    | NoteDeleted
    | NoteUpdated
    | NotePageLoaded
    | AppointmentNoteOnServerCreated
    | CareplanNoteOnServerCreated
    | CareplanNoteCreated
    | AppointmentNoteCreated;





