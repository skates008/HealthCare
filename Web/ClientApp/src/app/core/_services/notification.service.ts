// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// RxJS
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, QueryResultsModel, HttpUtilsService } from '../_base/crud';
// Models

import { Notification } from '../auth/_models/notification.model';


const API_NOTIFICATION_URL = 'api/notification';

const BaseUrl = environment.BaseURL;


@Injectable()
export class NotificationService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	findNotifications(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.get<Notification[]>(API_NOTIFICATION_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}


	createNotification(notification: Notification): Observable<Notification> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Notification>(API_NOTIFICATION_URL, notification, { headers: httpHeaders });
	}
}
