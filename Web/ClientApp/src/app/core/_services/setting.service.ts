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
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models


import { Setting } from '../auth/_models/settings.model';


const API_SETTING_URL = 'api/setting';


const BaseUrl = environment.BaseURL;


@Injectable()
export class SettingService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	findSettings(queryParams: QueryParamsModel, user_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_SETTING_URL}`;
		return this.http.get<Setting[]>(url).pipe(
			mergeMap(res => {
				res = res.filter(item => item.userId == user_id);
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);

			})
		);
	}

	updateSetting(_setting: Setting): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_SETTING_URL, _setting, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}
}
