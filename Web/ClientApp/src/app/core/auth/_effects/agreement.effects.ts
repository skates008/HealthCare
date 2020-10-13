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
import { AgreementService } from '../../_services';
// State
import { AppState } from '../../reducers';
import {
	AgreementActionTypes,
	AgreementPageRequested,
	AgreementPageLoaded,
	AgreementCreated,
	AgreementDeleted,
	AgreementFileDeleted,
	AgreementUpdated,
	AgreementOnServerCreated,
	AgreementActionToggleLoading,
	AgreementPageToggleLoading,
	GetAgreementDetailsById,
	GetAgreementDetailsByIdLoaded,
	AgreementUpdatedResponse
} from '../_actions/agreement.actions';

@Injectable()
export class AgreementEffects {
	showPageLoadingDistpatcher = new AgreementPageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new AgreementPageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new AgreementActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new AgreementActionToggleLoading({ isLoading: false });

	@Effect()
	loadAgreementPage$ = this.actions$
		.pipe(
			ofType<AgreementPageRequested>(AgreementActionTypes.AgreementPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.service.findAgreement(payload.page , payload.participantId);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new AgreementPageLoaded({
					agreement: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteAgreement$ = this.actions$
		.pipe(
			ofType<AgreementDeleted>(AgreementActionTypes.AgreementDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.service.deleteAgreement(payload.agreement);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

		@Effect()
		deleteFileAgreement$ = this.actions$
			.pipe(
				ofType<AgreementFileDeleted>(AgreementActionTypes.AgreementFileDeleted),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDistpatcher);
					return this.service.deleteFile(payload.id);
				}
				),
				map(() => {
					return this.hideActionLoadingDistpatcher;
				}),
			);

	@Effect()
	updateAgreement$ = this.actions$
		.pipe(
			ofType<AgreementUpdated>(AgreementActionTypes.AgreementUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				const requestToServer = this.service.updateAgreement(payload.agreement, '', '');
				return forkJoin(requestToServer);
			}),
			map((response) => {
				const result = response[0];
				return new AgreementUpdatedResponse({
					agreement: result.data,
					success: result.success
				});
			}),
		);

	@Effect()
	createAgreement$ = this.actions$
		.pipe(
			ofType<AgreementOnServerCreated>(AgreementActionTypes.AgreementOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.service.createAgreement(payload.agreement, payload.id).pipe(
					tap(res => {
						this.store.dispatch(new AgreementCreated({ agreement: res }));
					})
				);
			}),
			map((response) => {
				const result = response[0];
				return new AgreementUpdatedResponse({
					agreement: result.data,
					success: result.success
				});
			}),
		);

		@Effect()
		loadAgreementByIdPage$ = this.actions$
			.pipe(
				ofType<GetAgreementDetailsById>(AgreementActionTypes.GetAgreementDetailsById),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDistpatcher);
					const requestToServer = this.service.getAgreementById(payload.agreementId, '');
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					return new GetAgreementDetailsByIdLoaded({
						agreement: result.data,
						total: result.total,
						success: result.success
					});
				}),
			);
	constructor(private actions$: Actions, private service: AgreementService, private store: Store<AppState>) { }
}
