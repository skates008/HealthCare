import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { NoteState } from '../_reducers/note.reducers';

import { each } from 'lodash';
import { Note } from '../_models/note.model';
import { query } from '@angular/animations';

export const selectNoteState = createFeatureSelector<NoteState>('note');


export const selectNoteById = (noteId: number) => createSelector(
	selectNoteState,
	noteState => noteState.entities[noteId]
);


export const selectLastCreatedNoteId = createSelector(
	selectNoteState,
	noteState =>
		noteState.lastCreatedNoteId
);


export const allNoteLoaded = createSelector(
	selectNoteState,
	noteState => noteState.isAllNoteLoaded
);

export const selectQueryResultNote = createSelector(
	selectNoteState,
	noteState => {
		const data: Note[] = [];
		each(noteState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Note[] = httpExtension.sortArray(items, noteState.lastQuery.sortField, noteState.lastQuery.sortOrder);
		return new QueryResultsModel(noteState.queryResult, noteState.queryRowsCount);
	}
);









