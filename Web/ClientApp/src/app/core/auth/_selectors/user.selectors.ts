// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { UsersState } from '../_reducers/user.reducers';
import { each } from 'lodash';
import { User } from '../_models/user.model';


export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUserById = (userId: number) => createSelector(
	selectUsersState,
	usersState => usersState.entities[userId]
);

export const selectUsersPageLoading = createSelector(
	selectUsersState,
	usersState => {
		return usersState.listLoading;
	}
);

export const selectUsersActionLoading = createSelector(
	selectUsersState,
	usersState => usersState.actionsloading
);

export const selectLastCreatedUserId = createSelector(
	selectUsersState,
	usersState => usersState.lastCreatedUserId
);

export const selectUserIsSuccess = createSelector(
	selectUsersState,
	usersState => usersState.success
);
export const selectUsersPageLastQuery = createSelector(
	selectUsersState,
	usersState => usersState.lastQuery
);

export const selectUsersInStore = createSelector(
	selectUsersState,
	usersState => {
		const data: User[] = [];
		each(usersState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: User[] = httpExtension.sortArray(data, usersState.lastQuery.sortField, usersState.lastQuery.sortOrder);
		return new QueryResultsModel(data, usersState.total, '');
	}
);

export const selectUsersShowInitWaitingMessage = createSelector(
	selectUsersState,
	usersState => usersState.showInitWaitingMessage
);

export const selectHasUsersInStore = createSelector(
	selectUsersState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}

		return true;
	}
);
