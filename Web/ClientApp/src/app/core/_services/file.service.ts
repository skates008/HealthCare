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

import { Files } from '../auth/_models/file.model';


const API_FILE_URL = 'api/myinvoice';

const API_FILES_URL = 'api/files';


// Invoice APIs


const BaseUrl = environment.BaseURL;


@Injectable()
export class UserFileService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// File
	// CREATE =>  POST: add a new file to the server
	createFile(data: any, id) {
		const url = `${BaseUrl}api/patient/${id}/file`;
		return this.http.post<any>(url, data);
	}

	// Filter user notes
	findFile(queryParams: QueryParamsModel, id): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/patient/${id}/file/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(res);
			})
		);
	}

	getFileById(agreementId: string, id) {
		const url = `${BaseUrl}api/patient/${id}/serviceFile/${agreementId}`;
		return this.http.get<File>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// UPDATE => PUT: update the agreement on the server
	updateFile(agreement: Files, id, agreementId): Observable<any> {
		const url = `${BaseUrl}api/patient/${id}/file/${agreementId}`;
		return this.http.put(url, agreement).pipe(
			catchError(err => {
				return of(null);
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

	deleteFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.delete(url);
	}


}
