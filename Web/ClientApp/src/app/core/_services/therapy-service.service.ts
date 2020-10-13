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



import { TherapyService } from '../auth/_models/therapyService.model';
const API_THERAPYSERVICES_URL = 'api/therapyServices';


const BaseUrl = environment.BaseURL;


@Injectable()
export class TherapyServicesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	createTherapyService(TherapyService: TherapyService): Observable<TherapyService> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<TherapyService>(API_THERAPYSERVICES_URL, TherapyService, { headers: httpHeaders });
	}

	getAllTherapyServices(): Observable<TherapyService[]> {
		return this.http.get<TherapyService[]>(API_THERAPYSERVICES_URL);
	}

	getTherapyServiceById(TherapyServiceId: number) {
		if (!TherapyServiceId) {
			return of(null);
		}

		return this.http.get<TherapyService>(API_THERAPYSERVICES_URL + `/${TherapyServiceId}`);
	}

	deleteTherapyService(TherapyServiceId: number) {
		const url = `${API_THERAPYSERVICES_URL}/${TherapyServiceId}`;
		return this.http.delete(url);
	}

	updateTherapyService(_TherapyService: TherapyService): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_THERAPYSERVICES_URL, _TherapyService, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findTherapyServices(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.getAllTherapyServices().pipe(
			mergeMap((response: TherapyService[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);

			})
		);
	}

	loadTherapistAppointments(params): Observable<any> {
		const url = `${BaseUrl}api/appointment/list/gridview`;
		return this.http.post<any>(url, params).pipe(
			map((res) => {
				return res;
			}),
			catchError(err => {
				return null;
			})
		);
	}

}
