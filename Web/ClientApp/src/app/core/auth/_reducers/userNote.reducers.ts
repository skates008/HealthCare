// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { UserNoteActions, UserNoteActionTypes } from '../_actions/userNote.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { UserNote } from '../_models/userNote.model';

// tslint:disable-next-line:no-empty-interface
export interface UserNoteState extends EntityState<UserNote> {
	listLoading: boolean;
	actionsloading: boolean;
	total: number;
	lastCreatedUserNoteId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<UserNote> = createEntityAdapter<UserNote>();

export const initialUserNoteState: UserNoteState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedUserNoteId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function userNoteReducer(state = initialUserNoteState, action: UserNoteActions): UserNoteState {
	switch (action.type) {
		case UserNoteActionTypes.UserNotePageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedUserNoteId: undefined
		};
		case UserNoteActionTypes.UserNoteActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case UserNoteActionTypes.UserNoteOnServerCreated: return {
			...state
		};
		case UserNoteActionTypes.UserNoteCreated: return adapter.addOne(action.payload.userNote, {
			...state, success: action.payload.userNote.success
		});
		case UserNoteActionTypes.UserNoteUpdatedResponse: return adapter.addOne(action.payload.userNote, {
			...state, success: action.payload.userNote.success
		});
		case UserNoteActionTypes.UserNoteUpdated: return adapter.updateOne(action.payload.partialUserNote, state);
		case UserNoteActionTypes.UserNoteDeleted: return adapter.removeOne(action.payload.userNote, state);
		case UserNoteActionTypes.UserNotePageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case UserNoteActionTypes.UserNotePageLoaded: {
			return adapter.addMany(action.payload.userNote, {
				...initialUserNoteState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		case UserNoteActionTypes.GetUserNoteDetailsByIdLoaded: {
			return adapter.addOne(action.payload.userNote, {
				...initialUserNoteState,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getUserNoteState = createFeatureSelector<UserNoteState>('userNote');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
