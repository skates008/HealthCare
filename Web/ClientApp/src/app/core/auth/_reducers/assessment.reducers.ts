// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { AssessmentActions, AssessmentActionTypes } from '../_actions/assessment.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Assessment } from '../_models/assessment.model';

// tslint:disable-next-line:no-empty-interface
export interface AssessmentState extends EntityState<Assessment> {
	listLoading: boolean;
	actionsloading: boolean;
	total: number;
	lastCreatedAssessmentId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<Assessment> = createEntityAdapter<Assessment>();

export const initialAssessmentState: AssessmentState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedAssessmentId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function assessmentReducer(state = initialAssessmentState, action: AssessmentActions): AssessmentState {
	switch (action.type) {
		case AssessmentActionTypes.AssessmentPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedAssessmentId: undefined
		};
		case AssessmentActionTypes.AssessmentActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case AssessmentActionTypes.AssessmentOnServerCreated: return {
			...state
		};
		case AssessmentActionTypes.AssessmentCreated: return adapter.addOne(action.payload.assessment, {
			...state, success: action.payload.assessment.success
		});
		case AssessmentActionTypes.AssessmentUpdatedResponse: return adapter.addOne(action.payload.assessment, {
			...state, success: action.payload.assessment.success
		});
		case AssessmentActionTypes.AssessmentUpdated: return adapter.updateOne(action.payload.partialAssessment, state);
		case AssessmentActionTypes.AssessmentDeleted: return adapter.removeOne(action.payload.assessment, state);
		case AssessmentActionTypes.AssessmentPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case AssessmentActionTypes.AssessmentPageLoaded: {
			return adapter.addMany(action.payload.assessment, {
				...initialAssessmentState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		case AssessmentActionTypes.GetAssessmentDetailsByIdLoaded: {
			return adapter.addOne(action.payload.assessment, {
				...initialAssessmentState,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getAssessmentState = createFeatureSelector<AssessmentState>('assessment');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
