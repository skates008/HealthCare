import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { AllergiesState } from '../_reducers/allergy.reducers';

import { each } from 'lodash';
import { Allergy } from '../_models/allergy.model';
import { query } from '@angular/animations';

export const selectAllergiesState = createFeatureSelector<AllergiesState>('allergy');


// export const selectAllergiesByParticipantId =  createSelector(
//     selectAllergiesState,
//     allergiesState => {
//         const items: Allergy[] = [];
//         each(allergiesState.entities, element => {
//             items.push(element);
//         });
//         // return (items.filter(item => item.participant_id == participant_id));
//     }
// );



export const selectAllergiesByParticipantId = createSelector(
    selectAllergiesState,
    allergiesState => {
        const data: Allergy[] = [];
        each(allergiesState.entities, element => {
            data.push(element);
        });
        // const httpExtension = new HttpExtenstionsModel();
        // const result: Allergy[] = httpExtension.sortArray(items, allergiesState.lastQuery.sortField, allergiesState.lastQuery.sortOrder);
        return new QueryResultsModel(data, allergiesState.total, '');
    }
);


export const selectLastCreatedAllergyId = createSelector(
    selectAllergiesState,
    allergiesState =>
        allergiesState.lastCreatedAllergyId
);



