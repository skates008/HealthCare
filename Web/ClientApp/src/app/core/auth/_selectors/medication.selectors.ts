import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { MedicationsState } from '../_reducers/medication.reducers';

import { each } from 'lodash';
import { Medication } from '../_models/medication.model';
import { query } from '@angular/animations';

export const selectMedicationsState = createFeatureSelector<MedicationsState>('medication');




export const selectMedicationByParticipantId = createSelector(
    selectMedicationsState,
    medicationsState => {
        const data: Medication[] = [];
        each(medicationsState.entities, element => {
            data.push(element);
        });
        // return (items.filter(item => item.participant_id == participant_id));
        // const httpExtension = new HttpExtenstionsModel();
        // const result: Medication[] = httpExtension.sortArray(items, medicationsState.lastQuery.sortField, medicationsState.lastQuery.sortOrder);
        return new QueryResultsModel(data, medicationsState.total, '');
    }
);


export const selectLastCreatedMedicationId = createSelector(
    selectMedicationsState,
    appointmentsState =>
        appointmentsState.lastCreatedMedicationId
);



