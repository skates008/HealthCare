// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// RxJS
import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models

import { Agreement } from '../auth/_models/agreement.model';


const API_AGREEMENT_URL = 'api/agreement';

const API_AGREEMENTS_URL = 'api/agreements';

// Agreement APIs
const BaseUrl = environment.BaseURL;

@Injectable()
export class AgreementService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// Agreement
	// CREATE =>  POST: add a new agreement to the server
	createAgreement(data: any, id) {
		const url = `${BaseUrl}api/patient/${id}/serviceAgreement`;
		return this.http.post<any>(url, data);
	}

	// READ
	getAllAgreement(): Observable<Agreement[]> {
		const url = `${BaseUrl}api/serviceAgreement`;
		const data = {};
		return this.http.post<Agreement[]>(url, data);
	}

	// Filter user Agreement
	findAgreement(queryParams: QueryParamsModel, id): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/patient/${id}/serviceAgreement/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	getAgreementById(agreementId: string, id) {
		const url = `${BaseUrl}api/patient/${id}/serviceAgreement/${agreementId}`;
		return this.http.get<Agreement>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// DELETE => delete the agreement from the server
	deleteAgreement(agreement) {
		const url = `${BaseUrl}api/patient/${agreement.patientId}/serviceAgreement/${agreement.id}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the agreement on the server
	updateAgreement(agreement: Agreement, id, agreementId): Observable<any> {
		const url = `${BaseUrl}api/patient/${id}/serviceAgreement/${agreementId}`;
		return this.http.put(url, agreement).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	deleteFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.delete(url);
	}


	downloadFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.get(url, { responseType: 'blob' as 'json' }).pipe(
			catchError(err => {
				return of(null);
			}));
	}

}
