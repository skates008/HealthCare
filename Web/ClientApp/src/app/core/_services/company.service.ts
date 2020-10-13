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

import { Company } from '../auth/_models/company.model';
const API_COMPANYS_URL = 'api/provider/list';
const API_CREATE_PATIENT = 'api/patient';

const BaseUrl = environment.BaseURL;


@Injectable()
export class CompanyService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	createCompany(company: Company): Observable<Company> {
		return this.http.post<Company>(BaseUrl + API_CREATE_PATIENT, company).pipe(
			mergeMap(response => {
				return of(response);
			})
		);
	}

	findCompany(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + API_COMPANYS_URL, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	findCompanys(queryParams: QueryParamsModel): Observable<any> {
		return this.getAllCompanys().pipe(
			mergeMap((response: any) => {
				const result = this.httpUtils.baseFilter(response.data, queryParams, []);
				return of(result);
			})
		);
	}

	getAllCompanys(): Observable<Company[]> {
		const data = {};
		return this.http.post<Company[]>(BaseUrl + API_COMPANYS_URL, data);
	}


	getCompanyEditList() {
		const url = `${BaseUrl}api/provider`;
		return this.http.get<Company>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getCompanysProfile() {
		const url = `${BaseUrl}api/patient/myprofile`;
		return this.http.get<Company>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getCompanyEditForParticular(company: any): Observable<any> {
		if (!company) {
			return of(null);
		}
		const url = `${BaseUrl}api/provider`;
		return this.http.post<any>(url, company).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	updateCompany(_company: any): Observable<any> {
		const url = `${BaseUrl}api/provider/update`;
		return this.http.post(url, _company).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	deleteCompany(companyId) {
		const url = `${BaseUrl}api/patient/${companyId}`;
		return this.http.delete(url);
	}
}
