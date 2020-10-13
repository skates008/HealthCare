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
import { ProviderBasic } from '../auth/_models/providerBasic.model';




const BaseUrl = environment.BaseURL;


@Injectable()
export class ProviderService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	registerProvider(registrationData) {
		const url = `${BaseUrl}api/provider/registrationComplete`;
		return this.http.post<any>(url, registrationData).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}
}
