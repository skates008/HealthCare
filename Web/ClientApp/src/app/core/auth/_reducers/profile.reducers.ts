import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ProfileActions, ProfileActionTypes } from '../_actions/profile.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Profile } from '../_models/profile.model';

export interface ProfilesState extends EntityState<Profile> {
	listLoading: boolean;
	actionsLoading: boolean;
	queryRowsCount: number;
	total: number;
	lastCreatedProfileId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	getProfileDetails:any;
	getEditPageList: any;
	success: boolean;
}

export const adapter: EntityAdapter<Profile> = createEntityAdapter<Profile>();

export const initialProfilesState: ProfilesState = adapter.getInitialState({
	listLoading: false,
	actionsLoading: false,
	queryRowsCount: 0,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedProfileId: undefined,
	showInitWaitingMessage: true,
	getProfileDetails: undefined,
	getEditPageList: undefined,
	success: false,
});

export function profilesReducer(state = initialProfilesState, action: ProfileActions): ProfilesState {
	switch (action.type) {
		case ProfileActionTypes.ProfilesPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedProfileId: undefined
		};
		case ProfileActionTypes.ProfilesActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};


		case ProfileActionTypes.ProfileUpdatedLoaded: 
			return adapter.addOne(action.payload.profile, {
			...state,
			success: action.payload.profile
		});

		case ProfileActionTypes.ProfileUpdated: return adapter.updateOne(action.payload.profile, state);
		case ProfileActionTypes.ProfilesPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case ProfileActionTypes.ProfilesPageLoaded: {
			return adapter.addMany(action.payload.profiles, {
				...initialProfilesState,
				total: action.payload.total,
				queryRowsCount: action.payload.total,
				listLoading: false,
				showInitWaitingMessage: false
			});
		};

		case ProfileActionTypes.ProfileDetailsLoaded: {
			return adapter.addOne(action.payload.profiles, {
				...initialProfilesState,
				// total: action.payload.total,
			// getProfileDetails: action.payload.profiles
			});
		}

		case ProfileActionTypes.ProfilesEditPageLoaded: {
			return adapter.addOne(action.payload.profiles, {
				...initialProfilesState,
				getEditPageList: action.payload.profiles
			});
		};
		
		// case ProfileActionTypes.ProfileListLoadedForTimeEntry: {
		// 	return adapter.addOne(action.payload.profiles, {
		// 		...initialProfilesState,
		// 		total: action.payload.total,
		// 		// getEditPageList: action.payload.profiles
		// 	});
		// };
		default: return state;
	}
}

export const getUserState = createFeatureSelector<ProfilesState>('profile');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


