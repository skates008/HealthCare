// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { AppointmentTypeActions, AppointmentTypeActionTypes } from '../_actions/appointment-type.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { AppointmentType } from '../_models/appointment-type.model';

// tslint:disable-next-line:no-empty-interface
export interface AppointmentTypeState extends EntityState<AppointmentType> {
	listLoading: boolean;
	actionsloading: boolean;
	total: number;
	lastCreatedAppointmentTypeId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<AppointmentType> = createEntityAdapter<AppointmentType>();

export const initialAppointmentTypeState: AppointmentTypeState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedAppointmentTypeId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function appointmentTypeReducer(state = initialAppointmentTypeState, action: AppointmentTypeActions): AppointmentTypeState {
	switch (action.type) {
		case AppointmentTypeActionTypes.AppointmentTypePageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedAppointmentTypeId: undefined
		};
		case AppointmentTypeActionTypes.AppointmentTypeActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case AppointmentTypeActionTypes.AppointmentTypeOnServerCreated: return {
			...state
		};
		case AppointmentTypeActionTypes.AppointmentTypeCreated: return adapter.addOne(action.payload.appointmentType, {
			...state, success: action.payload.appointmentType.success
		});
		case AppointmentTypeActionTypes.AppointmentTypeUpdatedResponse: return adapter.addOne(action.payload.appointmentType, {
			...state, success: action.payload.appointmentType.success
		});
		case AppointmentTypeActionTypes.AppointmentTypeUpdated: return adapter.updateOne(action.payload.partialAppointmentType, state);
		case AppointmentTypeActionTypes.AppointmentTypeDeleted: return adapter.removeOne(action.payload.appointmentType, state);
		case AppointmentTypeActionTypes.AppointmentTypePageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case AppointmentTypeActionTypes.AppointmentTypePageLoaded: {
			return adapter.addMany(action.payload.appointmentType, {
				...initialAppointmentTypeState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		case AppointmentTypeActionTypes.GetAppointmentTypeDetailsByIdLoaded: {
			return adapter.addOne(action.payload.appointmentType, {
				...initialAppointmentTypeState,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getAppointmentTypeState = createFeatureSelector<AppointmentTypeState>('appointmentType');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
