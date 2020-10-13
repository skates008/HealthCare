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


import { Time } from '../auth/_models/time.model';
const API_TIMES_URL = 'api/times';


const BaseUrl = environment.BaseURL;


@Injectable()
export class TimeService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}
	createTime(Time: Time): Observable<any> {
		const url = `${BaseUrl}api/careplan/${Time.careplanId}/timeEntry`;
		return this.http.post<any>(url, Time).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// getAllTimes() {
	// 	const url = `${BaseUrl}api/timeEntry`;
	// 	return this.http.get(url);
	// }

	getTimeById(TimeId: number) {
		if (!TimeId) {
			return of(null);
		}

		return this.http.get<Time>(API_TIMES_URL + `/${TimeId}`);
	}

	findTime(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + 'api/timeEntry', queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	findTimes(): Observable<any> {
		const data = {};
		return this.http.post<any>(BaseUrl + 'api/timeEntry', {}).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}



	findTimesDetails(timeEntryID: string) {
		const url = `${BaseUrl}api/timeEntry/${timeEntryID}`;
		return this.http.get(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findStatementsPage(): Observable<any> {
		const data = {};
		return this.http.post<any>(BaseUrl + 'api/timeentry/mystatement/list', data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findStatementsViewPage(statementId: string): Observable<any> {
		return this.http.get<any>(BaseUrl + 'api/timeentry/' + statementId + '/mystatement').pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	deleteTime(TimeId) {
		const url = `${BaseUrl}api/timeentry/${TimeId}`;
		return this.http.delete(url);
	}

	updateTime(_Time: Time): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `${BaseUrl}api/careplan/${_Time.careplanId}/timeEntry/${_Time.id}`;
		return this.http.put(url, _Time).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	deleteBillableItemOfTimeEntries(timeEntry, billableItem) {
		const url = `${BaseUrl}api/timeentry/${timeEntry.id}/billableItem/${billableItem.id}`;
		return this.http.delete(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}
}
