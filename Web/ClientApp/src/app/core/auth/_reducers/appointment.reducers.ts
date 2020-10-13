import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { AppointmentActions, AppointmentActionTypes } from '../_actions/appointment.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Appointment } from '../_models/appointment.model';

export interface AppointmentsState extends EntityState<Appointment> {
    isAllAppointmentsLoaded: boolean;
    listLoading: boolean;
    actionsLoading: boolean;
    total: number;
    lastCreatedAppointmentId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    queryRowsCount: number;
    queryResult: Appointment[];
    recentAppointment: any;
    success: boolean
}

export const adapter: EntityAdapter<Appointment> = createEntityAdapter<Appointment>();

export const initialAppointmentsState: AppointmentsState = adapter.getInitialState({

    isAllAppointmentsLoaded: false,
    listLoading: false,
    actionsLoading: false,
    total: 0,
    lastQuery: new QueryParamsModel({}),
    lastCreatedAppointmentId: undefined,
    showInitWaitingMessage: true,
    queryRowsCount: 0,
    queryResult: [],
    recentAppointment: undefined,
    success: false,
});

export function appointmentsReducer(state = initialAppointmentsState, action: AppointmentActions): AppointmentsState {
    switch (action.type) {
        case AppointmentActionTypes.AppointmentPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedAppointmentId: undefined
        };
        case AppointmentActionTypes.AppointmentActionToggleLoading: return {
            ...state, actionsLoading: action.payload.isLoading
        };
        case AppointmentActionTypes.AppointmentOnServerCreated:
            return {
                ...state,
            };
        case AppointmentActionTypes.AppointmentCreated:
            return adapter.addOne(action.payload.appointment,
                {
                    ...state, lastCreatedAppointmentId: action.payload.appointment.data.id
                });

        case AppointmentActionTypes.FinalizeAppointmentResponse:
            return adapter.addOne(action.payload.appointment,
                {
                    ...state, lastCreatedAppointmentId: action.payload.appointment.data.id
        });

        case AppointmentActionTypes.CancelAppointmentResponse:
            return adapter.addOne(action.payload.appointment,
                {
                    ...state, lastCreatedAppointmentId: action.payload.appointment.data.id
        });

        case AppointmentActionTypes.AppointmentsPageLoaded: return adapter.addMany(action.payload.appointments, {
            ...initialAppointmentsState,
            listLoading: false,
            total: action.payload.total,
            queryResult: action.payload.appointments,
            lastQuery: action.payload.page,
            showInitWaitingMessage: false
        });
        case AppointmentActionTypes.AppointmentUpdated: return adapter.updateOne(action.payload.partialappointment, state);
        case AppointmentActionTypes.AppointmentDeleted: return adapter.removeOne(action.payload.id, state);
        case AppointmentActionTypes.AppointmentCancelled: return adapter.removeOne(action.payload.cancelData, state);
        case AppointmentActionTypes.AppointmentFinalize: return adapter.removeOne(action.payload.finalizeData, state);
        case AppointmentActionTypes.AppointmentArchived:
            return adapter.addOne(action.payload.appointment,
                {
                    ...state, appointment: action.payload.appointment
                });

        case AppointmentActionTypes.AssessmentAdded:
            return adapter.addOne(action.payload.appointment,
                {
                    ...state, appointment: action.payload.appointment
                });


        case AppointmentActionTypes.ObservationAdded:
            return adapter.addOne(action.payload.appointment,
                {
                    ...state, appointment: action.payload.appointment
                });

        case AppointmentActionTypes.UpcomingAppointmentPageLoaded: return adapter.addOne(action.payload.appointments, {
            ...initialAppointmentsState,
            listLoading: false,
            total: action.payload.total,
            queryResult: action.payload.appointments,
            success: action.payload.success,
            showInitWaitingMessage: false
        });

        case AppointmentActionTypes.GridViewAppointmentListLoaded: return adapter.addMany(action.payload.appointments, {
            ...initialAppointmentsState,
            listLoading: false,
            // total: action.payload.total,
            queryResult: action.payload.appointments,
            // lastQuery: action.payload.page,
            showInitWaitingMessage: false
        });

        case AppointmentActionTypes.RecentAppointmentsListLoaded: return adapter.addMany(action.payload.appointments, {
            ...initialAppointmentsState,
            listLoading: false,
            total: action.payload.total,
            queryResult: action.payload.appointments,
            lastQuery: action.payload.page,
            showInitWaitingMessage: false,
            recentAppointments: action.payload.appointments,
        });

        default: return state;
    }
}

export const getUserState = createFeatureSelector<AppointmentsState>('appointment');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();


