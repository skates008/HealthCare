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


import { Practitioner } from '../auth/_models/practitioner.model';
const API_LIST_PRACTITIONER = 'api/list/practitioner';


const BaseUrl = environment.BaseURL;


@Injectable()
export class PractitionerService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	findPractitioner(queryParams: QueryParamsModel): Observable<any[]> {
		// const data ={};
		return this.http.get<Practitioner[]>(BaseUrl + API_LIST_PRACTITIONER).pipe(
			mergeMap(res => {
				const value: any = res;
				return of(value);
			}));
		}

	findPractitionerWithTeam(teamId): Observable<any[]> {
		if (teamId) {
			return this.http.get<any[]>(BaseUrl + API_LIST_PRACTITIONER + '/' + teamId);
		}
	}
}
