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

import { UserNote } from '../auth/_models/userNote.model';

const API_USERNOTE_URL = 'api/usernote';

const API_USERNOTES_URL = 'api/usernotes';


// User notes APIs
const BaseUrl = environment.BaseURL;


@Injectable()
export class UserNoteService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

		// UserNote
	// CREATE =>  POST: add a new UserNote to the server
	createUserNote(data: any, id) {
		const url = `${BaseUrl}api/note`;
		return this.http.post<any>(url, data);
	}

	// READ
	getAllUserNote(): Observable<UserNote[]> {
		const url = `${BaseUrl}api/note`;
		const data = {};
		return this.http.post<UserNote[]>(url, data);
	}

	// Filter user notes
	findUserNote(queryParams: QueryParamsModel, id): Observable<any> {
		// This code imitates server calls
		// const url = `${BaseUrl}api/patient/${id}/note/list`;
		const url = `${BaseUrl}api/note/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	getUserNoteById(userNoteId: string, id) {
		const url = `${BaseUrl}api/note/${userNoteId}`;
		return this.http.get<UserNote>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// DELETE => delete the userNote from the server
	deleteUserNote(userNote) {
		const url = `${BaseUrl}api/note/${userNote.id}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the userNote on the server
	updateUserNote(userNote: UserNote, id, userNoteId): Observable<any> {
		const url = `${BaseUrl}api/note/${userNoteId}`;
		return this.http.put(url, userNote).pipe(
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
