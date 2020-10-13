import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { PractitionersState } from '../_reducers/practitioner.reducers';

import { each } from 'lodash';
import { Practitioner } from '../_models/practitioner.model';
import * as fromParticipant from '../_reducers/practitioner.reducers';
import { query } from '@angular/animations';

export const selectPractitionerState = createFeatureSelector<PractitionersState>('practitioner');

// export const selectParticipantById = (participantId) => createSelector(
// 	selectParticipantsState,
// 	participantsState => participantsState.entities[participantId]
// );


// export const selectParticipantsPageLoading = createSelector(
// 	selectParticipantsState,
// 	participantsState => {
// 		return participantsState.listLoading;
// 	}
// );

export const allPractitionerLoaded = createSelector(
	selectPractitionerState,
	practitionerState => practitionerState.isAllPractitionerLoaded
);

export const selectAllPractitioner = createSelector(
	selectPractitionerState,
	fromParticipant.selectAll
);

export const selectPractitionerActionLoading = createSelector(
	selectPractitionerState,
	practitionerState => practitionerState.actionsLoading
);

// export const selectLastCreatedParticipantId = createSelector(
// 	selectPractitionerState,
// 	participantsState => participantsState.lastCreatedParticipantId
// );

// export const selectParticipantsPageLastQuery = createSelector(
// 	selectParticipantsState,
// 	participantsState => participantsState.lastQuery
// );

export const selectPractitionerInStore = createSelector(
	selectPractitionerState,
	practitionerState => {
		const data: Practitioner[] = [];
		each(practitionerState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Practitioner[] = httpExtension.sortArray(items, practitionerState.lastQuery.sortField, practitionerState.lastQuery.sortOrder);
		return new QueryResultsModel(data, practitionerState.total, '');
	}
);

// export const selectParticipantsShowInitWaitingMessage = createSelector(
// 	selectParticipantsState,
// 	participantsState => participantsState.showInitWaitingMessage
// );

export const selectHasPractitionerInStore = createSelector(
	selectPractitionerState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);

