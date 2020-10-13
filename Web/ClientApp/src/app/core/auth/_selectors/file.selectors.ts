// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { FileState } from '../_reducers/file.reducers';
import { each } from 'lodash';
import { Files } from '../_models/file.model';


export const selectFileState = createFeatureSelector<FileState>('file');

export const selectFileById = (fileId: number) => createSelector(
	selectFileState,
	fileState => fileState.entities[fileId]
);

export const selectFilePageLoading = createSelector(
	selectFileState,
	fileState => {
		return fileState.listLoading;
	}
);

export const selectFileActionLoading = createSelector(
	selectFileState,
	fileState => fileState.actionsloading
);

export const selectLastCreatedFileId = createSelector(
	selectFileState,
	fileState => fileState.lastCreatedFileId
);

export const selectFileIsSuccess = createSelector(
	selectFileState,
	fileState => fileState.success
);
export const selectFilePageLastQuery = createSelector(
	selectFileState,
	fileState => fileState.lastQuery
);

export const selectFileInStore = createSelector(
	selectFileState,
	fileState => {
		const data: Files[] = [];
		each(fileState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: File[] = httpExtension.sortArray(items, fileState.lastQuery.sortField, fileState.lastQuery.sortOrder);
		return new QueryResultsModel(data, fileState.total, '');
	}
);

export const selectFileShowInitWaitingMessage = createSelector(
	selectFileState,
	fileState => fileState.showInitWaitingMessage
);

export const selectHasFileInStore = createSelector(
	selectFileState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}

		return true;
	}
);
