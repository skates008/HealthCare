import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ParticipantActions, ParticipantActionTypes } from '../_actions/participant.actions';

import { QueryParamsModel } from '../../_base/crud';

import { Participant } from '../_models/participant.model';

export interface ParticipantsState extends EntityState<Participant> {
	isAllParticipantsLoaded: boolean;
	listLoading: boolean;
	actionsLoading: boolean;
	queryResult: any;
	total: number;
	lastCreatedParticipantId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	getPatientById: any;
	initRegistration : any;
	registrationCompleteData:any;
	success: boolean;
}

export const adapter: EntityAdapter<Participant> = createEntityAdapter<Participant>();


export const initialParticipantsState: ParticipantsState = adapter.getInitialState({
	isAllParticipantsLoaded: false,
	listLoading: false,
	actionsLoading: false,
	queryResult: [],
	total: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedParticipantId: undefined,
	showInitWaitingMessage: true,
	getPatientById: undefined,
	initRegistration : undefined,
	registrationCompleteData:undefined,
	success: undefined
});

export function participantsReducer(state = initialParticipantsState, action: ParticipantActions): ParticipantsState {
	switch (action.type) {
		case ParticipantActionTypes.ParticipantsPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedParticipantId: undefined
		};
		case ParticipantActionTypes.ParticipantsActionToggleLoading: return {
			...state, actionsLoading: action.payload.isLoading
		};
		case ParticipantActionTypes.ParticipantOnServerCreated: return {
			...state
		};
		// case ParticipantActionTypes.ParticipantCreated: return adapter.addOne(action.payload.participant, {
		// 	...state, lastCreatedParticipantId: action.payload.participant.data.id
		// });

		case ParticipantActionTypes.ParticipantCreated: return adapter.addOne(action.payload.participant, {
			...state, success: action.payload.participant.success
		});
			case ParticipantActionTypes.ParticipantUpdatedResponse: 
			return adapter.addOne(action.payload.participant, {
			...state, success: action.payload.participant.success
		});
		case ParticipantActionTypes.ParticipantUpdated: return adapter.updateOne(action.payload.partialParticipant, state);
		case ParticipantActionTypes.ParticipantDeleted: return adapter.removeOne(action.payload.id, state);
		case ParticipantActionTypes.ParticipantsPageCancelled: return {
			...state, listLoading: false, lastQuery: new QueryParamsModel({})
		};
		case ParticipantActionTypes.AllParticipantsLoaded:
			 return adapter.addAll(action.payload.participants["data"], {
            ...state, isAllParticipantsLoaded: true
        });
		case ParticipantActionTypes.ParticipantsPageLoaded: {
			return adapter.addMany(action.payload.participants, {
				...initialParticipantsState,
				total: action.payload.total,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false
			});
		}	
		case ParticipantActionTypes.ParticipantByIdLoaded: {
			return adapter.addOne(action.payload.participant, {
				...initialParticipantsState,
				getPatientById: action.payload.participant,
			});
		}

		case ParticipantActionTypes.InitRegristrationLoaded: {
			return adapter.addOne(action.payload.participant, {
				...state,
				initRegistration: action.payload.participant
			});
		}
		case ParticipantActionTypes.RegistrationCompleteLoaded: {
			return adapter.addOne(action.payload.registrationCompleteData, {
				...state,
				registrationCompleteData: action.payload.registrationCompleteData,
				success: action.payload.success,
			});
		}
		case ParticipantActionTypes.ParticipantEditPageLoaded: {
			return adapter.addOne(action.payload.participants, {
				...state,
				queryResult: action.payload.participants,
			});
		}	

		case ParticipantActionTypes.ParticipantProfilePageLoaded: {
			return adapter.addOne(action.payload.participant, {
			...initialParticipantsState,
				queryResult: action.payload.participant,
			});
		}	
		default: return state;
	}
}

export const getUserState = createFeatureSelector<ParticipantsState>('participant');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();


