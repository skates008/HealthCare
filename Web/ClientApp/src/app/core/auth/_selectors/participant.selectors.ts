import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { ParticipantsState } from '../_reducers/participant.reducers';

import { each } from 'lodash';
import { Participant } from '../_models/participant.model';
import * as fromParticipant from '../_reducers/participant.reducers';
import { query } from '@angular/animations';

export const selectParticipantsState = createFeatureSelector<ParticipantsState>('participant');

export const selectParticipantById = (participantId) => createSelector(
	selectParticipantsState,
	participantsState => participantsState.entities[participantId]
);


export const selectParticipantsPageLoading = createSelector(
	selectParticipantsState,
	participantsState => {
		return participantsState.listLoading;
	}
);

export const allParticipantsLoaded = createSelector(
	selectParticipantsState,
	participantsState => participantsState.isAllParticipantsLoaded
);

export const selectAllParticipants = createSelector(
	selectParticipantsState,
	fromParticipant.selectAll
);

export const selectParticipantsActionLoading = createSelector(
	selectParticipantsState,
	participantsState => participantsState.actionsLoading
);

export const selectLastCreatedParticipantId = createSelector(
	selectParticipantsState,
	participantsState => participantsState.lastCreatedParticipantId
);

export const selectIsSuccess = createSelector(
	selectParticipantsState,
	participantsState => participantsState.success
);

export const getParticipantByIDSuccess = createSelector(
	selectParticipantsState,
	participantsState => participantsState.success
);



export const selectgetPatientById = createSelector(
	selectParticipantsState,
	participantsState => participantsState.getPatientById
);

export const selectInitRegistration = createSelector(
	selectParticipantsState,
	participantsState => participantsState.initRegistration
);

export const selectRegistrationComplete = createSelector(
	selectParticipantsState,
	participantsState => participantsState.registrationCompleteData
);

// export const isRegistrationSuccess = createSelector(
// 	selectParticipantsState,
// 	participantsState => participantsState.success
// );




export const selectParticipantsPageLastQuery = createSelector(
	selectParticipantsState,
	participantsState => participantsState.lastQuery
);

export const selectParticipantsInStore = createSelector(
	selectParticipantsState,
	participantsState => {
		const data: Participant[] = [];
		each(participantsState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Participant[] = httpExtension.sortArray(items, participantsState.lastQuery.sortField, participantsState.lastQuery.sortOrder);
		return new QueryResultsModel(data, participantsState.total, '');
	}
);

export const selectParticipantsShowInitWaitingMessage = createSelector(
	selectParticipantsState,
	participantsState => participantsState.showInitWaitingMessage
);

export const selectHasParticipantsInStore = createSelector(
	selectParticipantsState,
	queryResult => {
		if (!queryResult.total) {
			return false;
		}
		return true;
	}
);

