import { createFeatureSelector, createSelector } from '@ngrx/store';

import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';

import { NotificationState } from '../_reducers/notification.reducers';

import { each } from 'lodash';
import { Notification } from '../_models/notification.model';
import { query } from '@angular/animations';

export const selectNotificationState = createFeatureSelector<NotificationState>('notification');

export const selectNotificationByParticipantId = createSelector(
	selectNotificationState,
	notificationState => {
		const data: Notification[] = [];
		each(notificationState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Notification[] = httpExtension.sortArray(items, notificationState.lastQuery.sortField, notificationState.lastQuery.sortOrder);
		return new QueryResultsModel(data, notificationState.total, '');
	}
);

export const selectNotificationForTherapist = createSelector(
	selectNotificationState,
	notificationState => {
		const data: Notification[] = [];
		each(notificationState.entities, element => {
			data.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Notification[] = httpExtension.sortArray(items, notificationState.lastQuery.sortField, notificationState.lastQuery.sortOrder);
		return new QueryResultsModel(data, notificationState.total, '');
	}
);


export const selectLastCreatedNotificationId = createSelector(
	selectNotificationState,
	allergiesState =>
		allergiesState.lastCreatedNotificationId
);
