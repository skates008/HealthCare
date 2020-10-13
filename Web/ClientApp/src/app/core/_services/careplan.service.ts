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

import { Careplan } from '../auth/_models/careplan.model';



const API_LIST_CAREPLAN = 'api/patient/careplan/list';


const BaseUrl = environment.BaseURL;


@Injectable()
export class CareplanService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	createCareplan(Careplan: Careplan): Observable<Careplan> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `api/patient/${Careplan.patientId}/careplan`;
		return this.http.post<Careplan>(BaseUrl + url, Careplan, { headers: httpHeaders });
	}


	getAllCareplans(): Observable<any> {
		const data = {
			"Take": 10,
			"Skip": 0
		}
		return this.http.post<Careplan[]>(BaseUrl + API_LIST_CAREPLAN, data);
	}

	findCareplan(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl + API_LIST_CAREPLAN}`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	findCareplans(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = BaseUrl + API_LIST_CAREPLAN;
		return this.http.get<any>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	// findCareplans(queryParams: QueryParamsModel): Observable<any> {
	// 	return this.getAllCareplans().pipe(
	// 		mergeMap((response: Careplan[]) => {
	// 			const result = this.httpUtils.baseFilter(response, queryParams, []);
	// 			return of(response);
	// 		})
	// 	);
	// }

	deleteCareplan(Careplan: Careplan) {
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplan/${Careplan.id}`;
		return this.http.delete(url);
	}

	// findAllergies(queryParams: QueryParamsModel, participant_id): Observable<any> {


	getCareplanDetails(Careplan: any) {
		if (!Careplan) {
			return of(null);
		}
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplandetails/${Careplan.id}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findEditPageCareplans(Careplan) {
		if (!Careplan) {
			return of(null);
		}
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplan/${Careplan.id}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findCareplansForTimeEntry(id) {
		const url = `${BaseUrl}api/list/careplan/${id}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	updateCareplan(Careplan: Careplan): Observable<any> {
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplan/${Careplan.id}`;
		return this.http.put(url, Careplan).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	saveData(data, filename) {
		const a = document.createElement("a");
		document.body.appendChild(a);
		const json = data;
		const blob = new Blob([json], { type: "octet/stream" });
		const url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	}

	generateSummaryPlan(Careplan) {
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplan/${Careplan.id}/summaryreport`
		this.http.get(url, { responseType: 'blob' }).subscribe((res) => {
			this.saveData(res, 'Therapy Service Summamary.pdf');
		}, err => {
		})
	}


}
