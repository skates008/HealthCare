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
import { AssessmentService } from '../../../core/_services';
// State
import { AppState } from '../../reducers';
import {
	AssessmentActionTypes,
	AssessmentPageRequested,
	AssessmentPageLoaded,
	AssessmentCreated,
	AssessmentDeleted,
	AssessmentFileDeleted,
	AssessmentUpdated,
	AssessmentOnServerCreated,
	AssessmentActionToggleLoading,
	AssessmentPageToggleLoading,
	GetAssessmentDetailsById,
	GetAssessmentDetailsByIdLoaded,
	AssessmentUpdatedResponse
} from '../_actions/assessment.actions';

@Injectable()
export class AssessmentEffects {
	showPageLoadingDistpatcher = new AssessmentPageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new AssessmentPageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new AssessmentActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new AssessmentActionToggleLoading({ isLoading: false });

	@Effect()
	loadAssessmentPage$ = this.actions$
		.pipe(
			ofType<AssessmentPageRequested>(AssessmentActionTypes.AssessmentPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.auth.findAssessment(payload.page , payload.participantId);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new AssessmentPageLoaded({
					assessment: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteAssessment$ = this.actions$
		.pipe(
			ofType<AssessmentDeleted>(AssessmentActionTypes.AssessmentDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.deleteAssessment(payload.assessment);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

		@Effect()
		deleteFileAssessment$ = this.actions$
			.pipe(
				ofType<AssessmentFileDeleted>(AssessmentActionTypes.AssessmentFileDeleted),
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
	updateAssessment$ = this.actions$
		.pipe(
			ofType<AssessmentUpdated>(AssessmentActionTypes.AssessmentUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				const requestToServer = this.auth.updateAssessment(payload.assessment, '', '');
				return forkJoin(requestToServer);
			}),
			map((response) => {
				const result = response[0];
				return new AssessmentUpdatedResponse({
					assessment: result.data,
					success: result.success
				});
			}),
		);

	@Effect()
	createAssessment$ = this.actions$
		.pipe(
			ofType<AssessmentOnServerCreated>(AssessmentActionTypes.AssessmentOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.createAssessment(payload.assessment, payload.id).pipe(
					tap(res => {
						this.store.dispatch(new AssessmentCreated({ assessment: res }));
					})
				);
			}),
			map((response) => {
				const result = response[0];
				return new AssessmentUpdatedResponse({
					assessment: result.data,
					success: result.success
				});
			}),
		);

		@Effect()
		loadAssessmentByIdPage$ = this.actions$
			.pipe(
				ofType<GetAssessmentDetailsById>(AssessmentActionTypes.GetAssessmentDetailsById),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDistpatcher);
					const requestToServer = this.auth.getAssessmentById(payload.assessmentId, '');
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					return new GetAssessmentDetailsByIdLoaded({
						assessment: result.data,
						total: result.total,
						success: result.success
					});
				}),
			);
	constructor(private actions$: Actions, private auth: AssessmentService, private store: Store<AppState>) { }
}
