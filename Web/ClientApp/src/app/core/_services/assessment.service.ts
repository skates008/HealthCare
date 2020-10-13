// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable, of } from 'rxjs';
import {  catchError, mergeMap } from 'rxjs/operators';
// Lodash

// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models
import { Assessment } from '../auth/_models/assessment.model';


const BaseUrl = environment.BaseURL;


@Injectable()
export class AssessmentService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// Assessment
	// CREATE =>  POST: add a new assessment to the server
	createAssessment(data: any, id) {
		const url = `${BaseUrl}api/patient/${id}/assessment`;
		return this.http.post<any>(url, data);
	}

	// READ
	getAllAssessment(): Observable<Assessment[]> {
		const url = `${BaseUrl}api/assessment`;
		const data = {};
		return this.http.post<Assessment[]>(url, data);
	}

	// Filter user notes
	findAssessment(queryParams: QueryParamsModel, id): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/patient/${id}/assessment/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	getAssessmentById(assessmentId: string, id) {
		const url = `${BaseUrl}api/patient/${id}/assessment/${assessmentId}`;
		return this.http.get<Assessment>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// DELETE => delete the assessment from the server
	deleteAssessment(assessment) {
		const url = `${BaseUrl}api/patient/${assessment.patientId}/assessment/${assessment.id}`;
		return this.http.delete(url);
	}

	deleteFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the assessment on the server
	updateAssessment(assessment: Assessment, id, assessmentId): Observable<any> {
		const url = `${BaseUrl}api/patient/${id}/assessment/${assessmentId}`;
		return this.http.put(url, assessment).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findAssessments(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.getAllAssessment().pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	downloadFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.get(url, { responseType: 'blob' as 'json' }).pipe(
			catchError(err => {
				return of(null);
			}));
	}

}
