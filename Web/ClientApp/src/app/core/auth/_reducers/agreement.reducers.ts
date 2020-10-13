// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { AgreementActions, AgreementActionTypes } from '../_actions/agreement.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Agreement } from '../_models/agreement.model';

// tslint:disable-next-line:no-empty-interface
export interface AgreementState extends EntityState<Agreement> {
	listLoading: boolean;
	actionsloading: boolean;
	total: number;
	lastCreatedAgreementId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	success: boolean;
}

export const adapter: EntityAdapter<Agreement> = createEntityAdapter<Agreement>();

export const initialAgreementState: AgreementState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedAgreementId: undefined,
	showInitWaitingMessage: true,
	success: false
});

export function agreementReducer(state = initialAgreementState, action: AgreementActions): AgreementState {
	switch (action.type) {
		case AgreementActionTypes.AgreementPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedAgreementId: undefined
		};
		case AgreementActionTypes.AgreementActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case AgreementActionTypes.AgreementOnServerCreated: return {
			...state
		};
		case AgreementActionTypes.AgreementCreated: return adapter.addOne(action.payload.agreement, {
			...state, success: action.payload.agreement.success
		});
		case AgreementActionTypes.AgreementUpdatedResponse: return adapter.addOne(action.payload.agreement, {
			...state, success: action.payload.agreement.success
		});
		case AgreementActionTypes.AgreementUpdated: return adapter.updateOne(action.payload.partialAgreement, state);
		case AgreementActionTypes.AgreementDeleted: return adapter.removeOne(action.payload.agreement, state);
		case AgreementActionTypes.AgreementPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case AgreementActionTypes.AgreementPageLoaded: {
			return adapter.addMany(action.payload.agreement, {
				...initialAgreementState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		case AgreementActionTypes.GetAgreementDetailsByIdLoaded: {
			return adapter.addOne(action.payload.agreement, {
				...initialAgreementState,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}
		default: return state;
	}
}

export const getAgreementState = createFeatureSelector<AgreementState>('agreement');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
