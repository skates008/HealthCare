import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { AppointmentsState } from '../_reducers/appointment.reducers';

import { each } from 'lodash';
import { Appointment } from '../_models/appointment.model';
import { query } from '@angular/animations';

export const selectAppointmentsState = createFeatureSelector<AppointmentsState>('appointment');


export const selectAppointmentById = (appointmentId: number) => createSelector(
	selectAppointmentsState,
	appointmentsState => appointmentsState.entities[appointmentId]
);


export const selectLastCreatedAppointmentId = createSelector(
	selectAppointmentsState,
	appointmentsState =>
		appointmentsState.lastCreatedAppointmentId
);


export const allAppointmentsLoaded = createSelector(
	selectAppointmentsState,
	appointmentsState => appointmentsState.isAllAppointmentsLoaded
);


export const selectAppointmentPageLoading = createSelector(
	selectAppointmentsState,
	appointmentsState => {
		return appointmentsState.listLoading;
	}
);


export const selectAppointmentActionLoading = createSelector(
	selectAppointmentsState,
	appointmentsState => {
		return appointmentsState.actionsLoading;
	}
);

export const selectQueryResultAppointment = createSelector(
	selectAppointmentsState,
	appointmentsState => {
		const data: Appointment[] = [];
		each(appointmentsState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Appointment[] = httpExtension.sortArray(items, appointmentsState.lastQuery.sortField, appointmentsState.lastQuery.sortOrder);
		return new QueryResultsModel(data, appointmentsState.queryRowsCount);
	}
);

export const selectIsSuccess = createSelector(
	selectAppointmentsState,
	appointmentsState => appointmentsState.success
);

export const selectRecentAppointments = createSelector(
	selectAppointmentsState,
	appointmentsState => {
		const data: Appointment[] = [];
		each(appointmentsState.recentAppointment, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Appointment[] = httpExtension.sortArray(items, appointmentsState.lastQuery.sortField, appointmentsState.lastQuery.sortOrder);
		return new QueryResultsModel(data, appointmentsState.queryRowsCount);
	}
);








