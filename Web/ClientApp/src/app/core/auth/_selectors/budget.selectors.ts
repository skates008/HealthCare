import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { BudgetState } from '../_reducers/budget.reducers';

import { each } from 'lodash';
import { Budget } from '../_models/budget.model';
import { query } from '@angular/animations';

export const selectBudgetState = createFeatureSelector<BudgetState>('budget');


export const selectBudgetByParticipantId = (participant_id: any) => createSelector(
    selectBudgetState,
    BudgetState => {
        const items: Budget[] = [];
        each(BudgetState.entities, element => {
            items.push(element);
        });
        return items;
        // return (items.filter(item => item.participant_id == participant_id));
    }
);

export const selectLastCreatedBudgetId = createSelector(
    selectBudgetState,
    BudgetState =>
        BudgetState.lastCreatedbudgetId
);

export const selectFundedBudgetbyPatient = createSelector(
    selectBudgetState,
    BudgetState =>
        BudgetState.getFundedBuget
);

export const selectBudgetInStore = createSelector(
	selectBudgetState,
	BudgetState => {
		const data: Budget[] = [];
		each(BudgetState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Budget[] = httpExtension.sortArray(items, BudgetState.lastQuery.sortField, BudgetState.lastQuery.sortOrder);
		return new QueryResultsModel(data, BudgetState.total, '');
	}
);



