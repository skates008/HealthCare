
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { QueryParamsModel } from '../../_base/crud';
import { BudgetActions, BudgetActionTypes } from '../_actions/budget.actions';


import { Budget } from '../_models/budget.model';

export interface BudgetState extends EntityState<Budget> {
    isAllBudgetLoaded: boolean;
    listLoading: boolean;
    actionsLoading: boolean;
    total: number;
    lastCreatedbudgetId: number;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
    queryRowsCount: number;
    queryResult: Budget[];
    getFundedBuget: any;
}

export const adapter: EntityAdapter<Budget> = createEntityAdapter<Budget>();

export const initialBudgetState: BudgetState = adapter.getInitialState({
    isAllBudgetLoaded: false,
    listLoading: false,
    actionsLoading: false,
    total: 0,
    lastQuery: new QueryParamsModel({}),
    lastCreatedbudgetId: undefined,
    showInitWaitingMessage: true,
    queryRowsCount: 0,
    queryResult: [],
    getFundedBuget: undefined
});

export function budgetReducer(state = initialBudgetState, action: BudgetActions): BudgetState {
    switch (action.type) {
        case BudgetActionTypes.BudgetPageToggleLoading: return {
            ...state, listLoading: action.payload.isLoading, lastCreatedbudgetId: undefined
        };
        case BudgetActionTypes.BudgetActionToggleLoading: return {
            ...state, actionsLoading: action.payload.isLoading
        };
        case BudgetActionTypes.BudgetPageLoaded: return adapter.addMany(action.payload.budget,
            {
                ...initialBudgetState,
                listLoading: false,
                queryRowsCount: action.payload.total,
                queryResult: action.payload.budget,
                lastQuery: action.payload.page,
                showInitWaitingMessage: false,
            });
        case BudgetActionTypes.BudgetDeleted: return adapter.removeOne(action.payload.id, state);
        case BudgetActionTypes.BudgetOnServerCreated:
            return {
                ...state,
            };
        case BudgetActionTypes.BudgetCreated:
            return adapter.addOne(action.payload.budget,
                {
                    ...state, lastCreatedbudgetId: action.payload.budget.id
                });
        case BudgetActionTypes.BudgetUpdated: {
            const _partialBudget = [];
            // tslint:disable-next-line:prefer-const
            for (let i = 0; i < action.payload.updateBudget.length; i++) {
                _partialBudget.push({
                    id: action.payload.updateBudget[i].id,
                    changes: {
                        remainingBudget: action.payload.updateBudget[i].remainingBudget
                    }
                });
            }
            return adapter.updateMany(_partialBudget, state);
        }
        
        case BudgetActionTypes.GetBudgetByPatientLoaded: return adapter.addOne(action.payload.budget,
            {
                ...state,
                getFundedBuget : action.payload.budget
                
            });
        default: return state;
    }
}

export const getbudgetState = createFeatureSelector<BudgetState>('budget');

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();


