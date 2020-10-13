import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CareplanActions, CareplanActionTypes } from '../_actions/careplan.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Careplan } from '../_models/careplan.model';

export interface CareplansState extends EntityState<Careplan> {
	listLoading: boolean;
	actionsLoading: boolean;
	total: number;
	lastCreatedCareplanId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	getCareplanDetails:any;
	getEditPageList: any;
	success: boolean;
}

export const adapter: EntityAdapter<Careplan> = createEntityAdapter<Careplan>();

export const initialCareplansState: CareplansState = adapter.getInitialState({
	listLoading: false,
	actionsLoading: false,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedCareplanId: undefined,
	showInitWaitingMessage: true,
	getCareplanDetails: undefined,
	getEditPageList: undefined,
	success: false,
});

export function careplansReducer(state = initialCareplansState, action: CareplanActions): CareplansState {
	switch (action.type) {
		case CareplanActionTypes.CareplansPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedCareplanId: undefined
		};
		case CareplanActionTypes.CareplansActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case CareplanActionTypes.CareplanOnServerCreated: return {
			...state
		};
		case CareplanActionTypes.CareplanCreated:
			 return adapter.addOne(action.payload.careplan, {
			...state,
			lastCreatedCareplanId: action.payload.careplan.id,
			success: action.payload.success
		});
		case CareplanActionTypes.CareplanUpdated: return adapter.updateOne(action.payload.partialCareplan, state);
		case CareplanActionTypes.CareplanDeleted: return adapter.removeOne(action.payload.id, state);
		case CareplanActionTypes.CareplansPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case CareplanActionTypes.CareplansPageLoaded: {
			return adapter.addMany(action.payload.careplans, {
				...initialCareplansState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		};

		case CareplanActionTypes.CareplanDetailsLoaded: {
			return adapter.addOne(action.payload.careplans, {
				...initialCareplansState,
				// total: action.payload.total,
			// getCareplanDetails: action.payload.careplans
			});
		}

		case CareplanActionTypes.CareplansEditPageLoaded: {
			return adapter.addOne(action.payload.careplans, {
				...initialCareplansState,
				total: action.payload.total,
				getEditPageList: action.payload.careplans
			});
		};

		// case CareplanActionTypes.CareplanListLoadedForTimeEntry: {
		// 	return adapter.addOne(action.payload.careplans, {
		// 		...initialCareplansState,
		// 		total: action.payload.total,
		// 		// getEditPageList: action.payload.careplans
		// 	});
		// };
		default: return state;
	}
}

export const getUserState = createFeatureSelector<CareplansState>('careplan');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


