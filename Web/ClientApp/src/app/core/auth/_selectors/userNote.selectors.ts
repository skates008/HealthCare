// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { UserNoteState } from '../_reducers/userNote.reducers';
import { each } from 'lodash';
import { UserNote } from '../_models/userNote.model';


export const selectUserNoteState = createFeatureSelector<UserNoteState>('userNote');

export const selectUserNoteById = (userNoteId: number) => createSelector(
	selectUserNoteState,
	userNoteState => userNoteState.entities[userNoteId]
);

export const selectUserNotePageLoading = createSelector(
	selectUserNoteState,
	userNoteState => {
		return userNoteState.listLoading;
	}
);

export const selectUserNoteActionLoading = createSelector(
	selectUserNoteState,
	userNoteState => userNoteState.actionsloading
);

export const selectLastCreatedUserNoteId = createSelector(
	selectUserNoteState,
	userNoteState => userNoteState.lastCreatedUserNoteId
);

export const selectUserNoteIsSuccess = createSelector(
	selectUserNoteState,
	userNoteState => userNoteState.success
);
export const selectUserNotePageLastQuery = createSelector(
	selectUserNoteState,
	userNoteState => userNoteState.lastQuery
);

export const selectUserNoteInStore = createSelector(
	selectUserNoteState,
	userNoteState => {
		const data: UserNote[] = [];
		each(userNoteState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: UserNote[] = httpExtension.sortArray(items, userNoteState.lastQuery.sortField, userNoteState.lastQuery.sortOrder);
		return new QueryResultsModel(data, userNoteState.total, '');
	}
);

export const selectUserNoteShowInitWaitingMessage = createSelector(
	selectUserNoteState,
	userNoteState => userNoteState.showInitWaitingMessage
);

export const selectHasUserNoteInStore = createSelector(
	selectUserNoteState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}

		return true;
	}
);
