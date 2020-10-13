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

import { Allergy } from '../auth/_models/allergy.model';
import { Medication } from '../auth/_models/medication.model';


const API_LIST_MEDICATION = 'api/patient/medication/list'
const API_LIST_ALLERGIES = 'api/patient/allergy/list'
const API_CREATE_MEDICATION = 'api/patient/medication';
const API_CREATE_ALLERGIES = 'api/patient/allergy';



const API_MEDICATIONS_URL = 'api/patient/medication';
const API_ALLERGY_URL = 'api/patient/allergy';


const BaseUrl = environment.BaseURL;


@Injectable()
export class MedicationService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	findMedications(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = API_LIST_MEDICATION;
		const data = {};
		return this.http.post<Medication[]>(BaseUrl + url, data).pipe(
			mergeMap(res => {
				return of(res);
				// const medicationItems = res["data"];
				// res = medicationItems.filter(item => item.id == participant_id);
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				// return of(result);
			})
		);
	}

	createMedication(medication: Medication): Observable<Medication> {
		// const httpHeaders = new HttpHeaders();
		// httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Medication>(BaseUrl + API_CREATE_MEDICATION, medication);
	}

	deleteMedication(medicationId: number): Observable<Medication> {
		const httpParams = new HttpParams();
		const options = { params: httpParams };
		const url = `${API_MEDICATIONS_URL}/${medicationId}`;
		return this.http.delete<Medication>(BaseUrl + url, options);
	}

	findAllergies(queryParams: QueryParamsModel, participant_id): Observable<any> {
		const url = API_LIST_ALLERGIES;
		const data = {}
		return this.http.post<Allergy[]>(BaseUrl + url, {}).pipe(
			mergeMap(res => {
				// res = res.filter(item => item.participant_id == participant_id);
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(res);

			})
		);
	}

	deleteAllergy(allergyId: number): Observable<Allergy> {
		const httpParams = new HttpParams();
		const options = { params: httpParams };
		const url = `${API_ALLERGY_URL}/${allergyId}`;
		return this.http.delete<Allergy>(BaseUrl + url, options);
	}
	createAllergy(allergy: Allergy): Observable<Allergy> {
		return this.http.post<Allergy>(BaseUrl + API_CREATE_ALLERGIES, allergy);
	}
}
