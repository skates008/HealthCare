// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AssessmentState } from '../_reducers/assessment.reducers';
import { each } from 'lodash';
import { Assessment } from '../_models/assessment.model';


export const selectAssessmentState = createFeatureSelector<AssessmentState>('assessment');

export const selectAssessmentById = (assessmentId: number) => createSelector(
	selectAssessmentState,
	assessmentState => assessmentState.entities[assessmentId]
);

export const selectAssessmentPageLoading = createSelector(
	selectAssessmentState,
	assessmentState => {
		return assessmentState.listLoading;
	}
);

export const selectAssessmentActionLoading = createSelector(
	selectAssessmentState,
	assessmentState => assessmentState.actionsloading
);

export const selectLastCreatedAssessmentId = createSelector(
	selectAssessmentState,
	assessmentState => assessmentState.lastCreatedAssessmentId
);

export const selectAssessmentIsSuccess = createSelector(
	selectAssessmentState,
	assessmentState => assessmentState.success
);
export const selectAssessmentPageLastQuery = createSelector(
	selectAssessmentState,
	assessmentState => assessmentState.lastQuery
);

export const selectAssessmentInStore = createSelector(
	selectAssessmentState,
	assessmentState => {
		const data: Assessment[] = [];
		each(assessmentState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Assessment[] = httpExtension.sortArray(items, assessmentState.lastQuery.sortField, assessmentState.lastQuery.sortOrder);
		return new QueryResultsModel(data, assessmentState.total, '');
	}
);

export const selectAssessmentShowInitWaitingMessage = createSelector(
	selectAssessmentState,
	assessmentState => assessmentState.showInitWaitingMessage
);

export const selectHasAssessmentInStore = createSelector(
	selectAssessmentState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}

		return true;
	}
);
