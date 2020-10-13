// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { AppointmentTypeService } from '../../_services/appointment-type.service';
// State
import { AppState } from '../../reducers';
import {
	AppointmentTypeActionTypes,
	AppointmentTypePageRequested,
	AppointmentTypePageLoaded,
	AppointmentTypeCreated,
	AppointmentTypeDeleted,
	AppointmentTypeFileDeleted,
	AppointmentTypeUpdated,
	AppointmentTypeOnServerCreated,
	AppointmentTypeActionToggleLoading,
	AppointmentTypePageToggleLoading,
	GetAppointmentTypeDetailsById,
	GetAppointmentTypeDetailsByIdLoaded,
	AppointmentTypeUpdatedResponse
} from '../_actions/appointment-type.actions';

@Injectable()
export class AppointmentTypeEffects {
	showPageLoadingDistpatcher = new AppointmentTypePageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new AppointmentTypePageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new AppointmentTypeActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new AppointmentTypeActionToggleLoading({ isLoading: false });

	@Effect()
	loadAppointmentTypePage$ = this.actions$
		.pipe(
			ofType<AppointmentTypePageRequested>(AppointmentTypeActionTypes.AppointmentTypePageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.auth.findAppointmentType(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new AppointmentTypePageLoaded({
					appointmentType: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteAppointmentType$ = this.actions$
		.pipe(
			ofType<AppointmentTypeDeleted>(AppointmentTypeActionTypes.AppointmentTypeDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.deleteAppointmentType(payload.appointmentType);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

		@Effect()
		deleteFileAppointmentType$ = this.actions$
			.pipe(
				ofType<AppointmentTypeFileDeleted>(AppointmentTypeActionTypes.AppointmentTypeFileDeleted),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDistpatcher);
					return this.auth.deleteFile(payload.id);
				}
				),
				map(() => {
					return this.hideActionLoadingDistpatcher;
				}),
			);

	@Effect()
	updateAppointmentType$ = this.actions$
		.pipe(
			ofType<AppointmentTypeUpdated>(AppointmentTypeActionTypes.AppointmentTypeUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				const requestToServer = this.auth.updateAppointmentType(payload.appointmentType, '');
				return forkJoin(requestToServer);
			}),
			map((response) => {
				const result = response[0];
				return new AppointmentTypeUpdatedResponse({
					appointmentType: result.data,
					success: result.success
				});
			}),
		);

	@Effect()
	createAppointmentType$ = this.actions$
		.pipe(
			ofType<AppointmentTypeOnServerCreated>(AppointmentTypeActionTypes.AppointmentTypeOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.createAppointmentType(payload.appointmentType).pipe(
					tap(res => {
						this.store.dispatch(new AppointmentTypeCreated({ appointmentType: res }));
					})
				);
			}),
			map((response) => {
				const result = response;
				return new AppointmentTypeUpdatedResponse({
					appointmentType: result.data,
					success: result.success
				});
			}),
		);

		@Effect()
		loadAppointmentTypeByIdPage$ = this.actions$
			.pipe(
				ofType<GetAppointmentTypeDetailsById>(AppointmentTypeActionTypes.GetAppointmentTypeDetailsById),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDistpatcher);
					const requestToServer = this.auth.getAppointmentTypeById(payload.appointmentTypeId);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					return new GetAppointmentTypeDetailsByIdLoaded({
						appointmentType: result.data,
						total: result.total,
						success: result.success
					});
				}),
			);
	constructor(private actions$: Actions, private auth: AppointmentTypeService, private store: Store<AppState>) { }
}
