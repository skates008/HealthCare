import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { ProvidersState } from '../_reducers/provider.reducers';

import { each } from 'lodash';
import { Provider } from '../_models/provider.model';
import { query } from '@angular/animations';

export const selectProviderState = createFeatureSelector<ProvidersState>('provider');

export const selectProviderInStore = createSelector(
	selectProviderState,
	providerState => {
		const data: Provider[] = [];
		each(providerState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Provider[] = httpExtension.sortArray(items, providerState.lastQuery.sortField, providerState.lastQuery.sortOrder);
		return new QueryResultsModel(data, providerState.total, '');
	}
);

export const selectIsProviderCreateSuccess = createSelector(
	selectProviderState,
	ProvidersState => ProvidersState.success,
);

export const selectLastCreatedProviderId = createSelector(
    selectProviderState,
    appointmentsState =>
        appointmentsState.lastCreatedProviderId
);
