// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { UserActions, UserActionTypes } from '../_actions/user.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { User } from '../_models/user.model';

// tslint:disable-next-line:no-empty-interface
export interface UsersState extends EntityState<User> {
	total: number;
	listLoading: boolean;
	actionsloading: boolean;
	lastCreatedUserId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialUsersState: UsersState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedUserId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function usersReducer(state = initialUsersState, action: UserActions): UsersState {
	switch (action.type) {
		case UserActionTypes.UsersPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedUserId: undefined
		};
		case UserActionTypes.UsersActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case UserActionTypes.UserOnServerCreated: return {
			...state
		};
		case UserActionTypes.UserCreated: return adapter.addOne(action.payload.user, {
			...state, success: action.payload.user.success
		});
		case UserActionTypes.UserUpdatedResponse: return adapter.addOne(action.payload.user, {
			...state, success: action.payload.user.success
		});
		case UserActionTypes.UserUpdated: return adapter.updateOne(action.payload.partialUser, state);
		case UserActionTypes.UserDeleted: return adapter.removeOne(action.payload.id, state);
		case UserActionTypes.UsersPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case UserActionTypes.UsersPageLoaded: {
			return adapter.addMany(action.payload.users, {
				...initialUsersState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		case UserActionTypes.GetUserDetailsByIdLoaded: {
			return adapter.addOne(action.payload.users, {
				...initialUsersState,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getUserState = createFeatureSelector<UsersState>('users');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
