import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CompanyActions, CompanyActionTypes } from '../_actions/company.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Company } from '../_models/company.model';

export interface CompanysState extends EntityState<Company> {
	isAllCompanysLoaded: boolean;
	listLoading: boolean;
	actionsLoading: boolean;
	queryResult: any;
	total: number;
	lastCreatedCompanyId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	getPatientById: any;
	initRegistration : any;
	registrationCompleteData:any;
	success: boolean;
}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();


export const initialCompanysState: CompanysState = adapter.getInitialState({
	isAllCompanysLoaded: false,
	listLoading: false,
	actionsLoading: false,
	queryResult: [],
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedCompanyId: undefined,
	showInitWaitingMessage: true,
	getPatientById: undefined,
	initRegistration : undefined,
	registrationCompleteData:undefined,
	success: undefined
});

export function companysReducer(state = initialCompanysState, action: CompanyActions): CompanysState {
	switch (action.type) {
		case CompanyActionTypes.CompanysPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedCompanyId: undefined
		};
		case CompanyActionTypes.CompanysActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case CompanyActionTypes.CompanyOnServerCreated: return {
			...state
		};
		// case CompanyActionTypes.CompanyCreated: return adapter.addOne(action.payload.company, {
		// 	...state, lastCreatedCompanyId: action.payload.company.data.id
		// });

		case CompanyActionTypes.CompanyCreated: return adapter.addOne(action.payload.company, {
			...state, success: action.payload.company.success
		});
			case CompanyActionTypes.CompanyUpdatedResponse: 
			return adapter.addOne(action.payload.company, {
			...state, success: action.payload.company.success
		});
		case CompanyActionTypes.CompanyUpdated: return adapter.updateOne(action.payload.partialCompany, state);
		case CompanyActionTypes.CompanyDeleted: return adapter.removeOne(action.payload.id, state);
		case CompanyActionTypes.CompanysPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case CompanyActionTypes.AllCompanysLoaded:
			 return adapter.addAll(action.payload.companys["data"], {
            ...state, isAllCompanysLoaded: true
        });
		case CompanyActionTypes.CompanysPageLoaded: {
			return adapter.addMany(action.payload.companys, {
				...initialCompanysState,
				total: action.payload.total,
				queryResult: action.payload.companys,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}	
		case CompanyActionTypes.CompanyByIdLoaded: {
			return adapter.addOne(action.payload.company, {
				...initialCompanysState,
				getPatientById: action.payload.company,
			});
		}

		case CompanyActionTypes.InitRegristrationLoaded: {
			return adapter.addOne(action.payload.company, {
				...state,
				initRegistration: action.payload.company
			});
		}
		case CompanyActionTypes.RegistrationCompleteLoaded: {
			return adapter.addOne(action.payload.registrationCompleteData, {
				...state,
				registrationCompleteData: action.payload.registrationCompleteData,
				success: action.payload.success,
			});
		}
		case CompanyActionTypes.CompanyEditPageLoaded: {
			return adapter.addOne(action.payload.companys, {
				...state,
				queryResult: action.payload.companys,
			});
		}	

		case CompanyActionTypes.CompanyProfilePageLoaded: {
			return adapter.addOne(action.payload.company, {
			...initialCompanysState,
				queryResult: action.payload.company,
			});
		}	
		default: return state;
	}
}

export const getUserState = createFeatureSelector<CompanysState>('company');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


