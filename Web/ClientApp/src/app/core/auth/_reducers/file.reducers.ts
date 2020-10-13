// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { FileActions, FileActionTypes } from '../_actions/file.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Files } from '../_models/file.model';

// tslint:disable-next-line:no-empty-interface
export interface FileState extends EntityState<Files> {
	listLoading: boolean;
	actionsloading: boolean;
	total: number;
	lastCreatedFileId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<Files> = createEntityAdapter<Files>();

export const initialFileState: FileState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedFileId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function fileReducer(state = initialFileState, action: FileActions): FileState {
	switch (action.type) {
		case FileActionTypes.FilePageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedFileId: undefined
		};
		case FileActionTypes.FileActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case FileActionTypes.FileOnServerCreated: return {
			...state
		};
		case FileActionTypes.FileCreated: return adapter.addOne(action.payload.file, {
			...state, success: action.payload.file.success
		});
		case FileActionTypes.FileUpdatedResponse: return adapter.addOne(action.payload.file, {
			...state, success: action.payload.file.success
		});
		case FileActionTypes.FileUpdated: return adapter.updateOne(action.payload.partialFile, state);
		case FileActionTypes.FileDeleted: return adapter.removeOne(action.payload.file, state);
		case FileActionTypes.FilePageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case FileActionTypes.FilePageLoaded: {
			return adapter.addMany(action.payload.file, {
				...initialFileState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		case FileActionTypes.GetFileDetailsByIdLoaded: {
			return adapter.addOne(action.payload.file, {
				...initialFileState,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getFileState = createFeatureSelector<FileState>('file');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
