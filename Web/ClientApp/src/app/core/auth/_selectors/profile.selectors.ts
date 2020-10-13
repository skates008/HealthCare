import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { ProfilesState } from '../_reducers/profile.reducers';

import { each } from 'lodash';
import { Profile } from '../_models/profile.model';
import { query } from '@angular/animations';

export const selectProfilesState = createFeatureSelector<ProfilesState>('Profile');

export const selectProfileById = (ProfileId: any) => createSelector(
	selectProfilesState,
	ProfilesState => ProfilesState.entities[ProfileId]
);


export const selectProfilesPageLoading = createSelector(
	selectProfilesState,
	ProfilesState => {
		return ProfilesState.listLoading;
	}
);

export const selectProfilesActionLoading = createSelector(
	selectProfilesState,
	ProfilesState => ProfilesState.actionsLoading
);

export const selectLastCreatedProfileId = createSelector(
	selectProfilesState,
	ProfilesState => ProfilesState.lastCreatedProfileId,
);

export const selectIsProfileCreateSuccess = createSelector(
	selectProfilesState,
	ProfilesState => ProfilesState.success,
);

export const selectProfilesPageLastQuery = createSelector(
	selectProfilesState,
	ProfilesState => ProfilesState.lastQuery
);

export const selectProfilesInStore = createSelector(
	selectProfilesState,
	ProfilesState => {
		const data: Profile[] = [];
		each(ProfilesState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Profile[] = httpExtension.sortArray(items, ProfilesState.lastQuery.sortField, ProfilesState.lastQuery.sortOrder);
		return new QueryResultsModel(data, ProfilesState.total, '');
	}
);

export const selectProfilesShowInitWaitingMessage = createSelector(
	selectProfilesState,
	ProfilesState => ProfilesState.showInitWaitingMessage
);

export const selectHasProfilesInStore = createSelector(
	selectProfilesState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);

	export const selectProfileDetails = createSelector(
		selectProfilesState,
		ProfilesState => ProfilesState.getProfileDetails
	);

	export const selectProfileEditPage = createSelector(
		selectProfilesState,
		ProfilesState => ProfilesState.getEditPageList
	);
	

