
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { NoteActions, NoteActionTypes } from '../_actions/note.actions';


import { Note } from '../_models/note.model';

export interface NoteState extends EntityState<Note> {
    isAllNoteLoaded: boolean;
    listLoading: boolean;
    actionsLoading: boolean;
    total: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    queryRowsCount: number;
    queryResult: Note[];
    lastCreatedNoteId: any;

}

export const adapter: EntityAdapter<Note> = createEntityAdapter<Note>();

export const initialNoteState: NoteState = adapter.getInitialState({
    isAllNoteLoaded: false,
    listLoading: false,
    actionsLoading: false,
    total: 0,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedNoteId: undefined,

});

export function noteReducer(state = initialNoteState, action: NoteActions): NoteState {
    switch (action.type) {
        case NoteActionTypes.NotePageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedNoteId: undefined
        };
        case NoteActionTypes.NoteActionToggleLoading: return {
            ...state, actionsLoading: action.payload.isLoading
        };
        case NoteActionTypes.NotePageLoaded: return adapter.addMany(action.payload.note,
            {
                ...initialNoteState,
                listLoading: false,
                queryRowsCount: action.payload.total,
                queryResult: action.payload.note,
                lastQuery: action.payload.page,
                showInitWaitingMessage: false,
            });
        case NoteActionTypes.NoteDeleted: return adapter.removeOne(action.payload.id, state);
        case NoteActionTypes.NoteOnServerCreated:
            return {
                ...state,
            };
        case NoteActionTypes.NoteCreated:
            return adapter.addOne(action.payload.note.id,
                {
                    ...state, lastCreatedNoteId: action.payload.note.id
                });
        case NoteActionTypes.AppointmentNoteCreated:
        return adapter.addOne(action.payload.note.id,
             {
                 ...state, lastCreatedNoteId: action.payload.note.id
            });
        
        case NoteActionTypes.CareplanNoteCreated:
            return adapter.addOne(action.payload.note.id,
             {
                ...state, lastCreatedNoteId: action.payload.note.id
             });

        default: return state;
    }

    
}

export const getNoteState = createFeatureSelector<NoteState>('note');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();


