import { Injectable } from '@angular/core';

import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../../core/reducers';

import {
	AppointmentOnServerCreated,
	AppointmentCreated,
	AppointmentActionTypes,
	AppointmentPageToggleLoading,
	AppointmentActionToggleLoading,
	AppointmentsPageRequested,
	AppointmentsPageLoaded,
	AppointmentUpdated,
	AppointmentDeleted,
	AppointmentArchived,
	AssessmentAdded,
	ObservationAdded,
	AppointmentCancelled,
	AppointmentFinalize,
	UpcomingAppointmentPageLoaded,
	UpcomingAppointmentPageRequested,
	CancelAppointmentResponse,
	FinalizeAppointmentResponse,
	RecentAppointmentListRequested,
	RecentAppointmentsListLoaded,
	GridViewAppointmentList,
	GridViewAppointmentListLoaded
} from '../_actions/appointment.actions';

import { AppointmentService} from '../../../core/_services';

@Injectable()
export class AppointmentEffects {
	showPageLoadingDispatcher = new AppointmentPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new AppointmentPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new AppointmentActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new AppointmentActionToggleLoading({ isLoading: false });

	@Effect()
	createAppointment$ = this.actions$
		.pipe(
			ofType<AppointmentOnServerCreated>(AppointmentActionTypes.AppointmentOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.createAppointment(payload.appointment);
				return forkJoin(requestToServer, );
			}),
			map(response => {
				const result = response[0];
				this.store.dispatch(this.showPageLoadingDispatcher);
				return new AppointmentCreated({
					appointment: result,
				});
			}),
		);

	@Effect()
	loadAppointmentsPage$ = this.actions$
		.pipe(
			ofType<AppointmentsPageRequested>(AppointmentActionTypes.AppointmentsPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findAppointments(payload.page, payload.appointmentParams);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];
				this.store.dispatch(this.showPageLoadingDispatcher);

				return new AppointmentsPageLoaded({
					appointments: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	updateAppointment$ = this.actions$
		.pipe(
			ofType<AppointmentUpdated>(AppointmentActionTypes.AppointmentUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.updateAppointment(payload.appointment);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	deleteAppointment$ = this.actions$
		.pipe(
			ofType<AppointmentDeleted>(AppointmentActionTypes.AppointmentDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.deleteAppointment(payload.id);
			}
			),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	archiveAppointment$ = this.actions$
		.pipe(
			ofType<AppointmentArchived>(AppointmentActionTypes.AppointmentArchived),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.archiveAppointment(payload.appointment);
			}
			),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	AssessmentAdded$ = this.actions$
		.pipe(
			ofType<AssessmentAdded>(AppointmentActionTypes.AssessmentAdded),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.addAssessment(payload.appointment);
			}
			),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	ObservationAdded$ = this.actions$
		.pipe(
			ofType<ObservationAdded>(AppointmentActionTypes.ObservationAdded),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.addObservation(payload.appointment);
			}
			),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	@Effect()
	cancelAppointment$ = this.actions$
		.pipe(
			ofType<AppointmentCancelled>(AppointmentActionTypes.AppointmentCancelled),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				const requestToServer =  this.auth.cancelAppointment(payload.id,payload.cancelData);
				return forkJoin(requestToServer);
			}
			),
			map(response => {
				const result = response[0];
				this.store.dispatch(this.showPageLoadingDispatcher);
				return new CancelAppointmentResponse({
					appointment: result,
				});
			}),
		);


		@Effect()
		finalizeAppointment$ = this.actions$
		.pipe(
			ofType<AppointmentFinalize>(AppointmentActionTypes.AppointmentFinalize),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				const requestToServer= this.auth.finalizeAppointment(payload.id,payload.finalizeData);
				return forkJoin(requestToServer, );
			}
			),
			map(response=> {
				const result = response[0];
				this.store.dispatch(this.showPageLoadingDispatcher);
				return new FinalizeAppointmentResponse({
					appointment: result,
				});
			})
		);

		@Effect()
		loadUpcomingAppointmentPage$ = this.actions$
			.pipe(
				ofType<UpcomingAppointmentPageRequested>(AppointmentActionTypes.UpcomingAppointmentPageRequested),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.auth.findUpcomingAppointments();
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					this.store.dispatch(this.showPageLoadingDispatcher);
					return new UpcomingAppointmentPageLoaded({
						appointments: result.data,
						total: result.length,
						success: result.success,
					});
				}),
			);

			@Effect()
			loadRecentAppointments$ = this.actions$
				.pipe(
					ofType<RecentAppointmentListRequested>(AppointmentActionTypes.RecentAppointmentListRequested),
					mergeMap(({ payload }) => {
						this.store.dispatch(this.showPageLoadingDispatcher);
						const requestToServer = this.auth.findAppointments(payload.page, payload.appointmentParams);
						const lastQuery = of(payload.page);
						return forkJoin(requestToServer, lastQuery);
					}),
					map(response => {
						const result = response[0];
						const lastQuery: QueryParamsModel = response[1];
						this.store.dispatch(this.showPageLoadingDispatcher);
						return new RecentAppointmentsListLoaded({
							appointments: result.data,
							total: result.total,
							page: lastQuery
						});
					}),
				);

				@Effect()
				loadGridViewAppointmentList$ = this.actions$
					.pipe(
						ofType<GridViewAppointmentList>(AppointmentActionTypes.GridViewAppointmentList),
						mergeMap(({ payload }) => {
							this.store.dispatch(this.showPageLoadingDispatcher);
							const requestToServer = this.auth.loadGridViewAppointments(payload.params);
							return forkJoin(requestToServer);
						}),
						map(response => {
							const result = response[0];
							console.log("result grid view", result);
							this.store.dispatch(this.showPageLoadingDispatcher);
							return new GridViewAppointmentListLoaded({
								appointments: result.data,
							});
						}),
					);

	constructor(private actions$: Actions, private auth: AppointmentService, private store: Store<AppState>) { }

}
