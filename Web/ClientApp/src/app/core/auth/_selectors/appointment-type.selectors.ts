// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AppointmentTypeState } from '../_reducers/appointment-type.reducers';
import { each } from 'lodash';
import { AppointmentType } from '../_models/appointment-type.model';


export const selectAppointmentTypeState = createFeatureSelector<AppointmentTypeState>('appointmentType');

export const selectAppointmentTypeById = (appointmentTypeId: number) => createSelector(
	selectAppointmentTypeState,
	appointmentTypeState => appointmentTypeState.entities[appointmentTypeId]
);

export const selectAppointmentTypePageLoading = createSelector(
	selectAppointmentTypeState,
	appointmentTypeState => {
		return appointmentTypeState.listLoading;
	}
);

export const selectAppointmentTypeActionLoading = createSelector(
	selectAppointmentTypeState,
	appointmentTypeState => appointmentTypeState.actionsloading
);

export const selectLastCreatedAppointmentTypeId = createSelector(
	selectAppointmentTypeState,
	appointmentTypeState => appointmentTypeState.lastCreatedAppointmentTypeId
);

export const selectAppointmentTypeIsSuccess = createSelector(
	selectAppointmentTypeState,
	appointmentTypeState => appointmentTypeState.success
);
export const selectAppointmentTypePageLastQuery = createSelector(
	selectAppointmentTypeState,
	appointmentTypeState => appointmentTypeState.lastQuery
);

export const selectAppointmentTypeInStore = createSelector(
	selectAppointmentTypeState,
	appointmentTypeState => {
		const data: AppointmentType[] = [];
		each(appointmentTypeState.entities, element => {
			data.push(element);
		});
		return new QueryResultsModel(data, appointmentTypeState.total, '');
	}
);

export const selectAppointmentTypeShowInitWaitingMessage = createSelector(
	selectAppointmentTypeState,
	appointmentTypeState => appointmentTypeState.showInitWaitingMessage
);

export const selectHasAppointmentTypeInStore = createSelector(
	selectAppointmentTypeState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}

		return true;
	}
);
