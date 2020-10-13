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
import { AppointmentType } from '../auth/_models/appointment-type.model';


const BaseUrl = environment.BaseURL;


@Injectable()
export class AppointmentTypeService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// AppointmentType
	// CREATE =>  POST: add a new appointmentType to the server
	createAppointmentType(data: any) {
		const url = `${BaseUrl}api/settings/appointmenttype`;
		return this.http.post<any>(url, data);
	}

	// Filter user notes
	findAppointmentType(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/settings/appointmenttype/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				return of(value);
			})
		);
	}

	getAppointmentTypeById(appointmentTypeId: string) {
		const url = `${BaseUrl}api/settings/appointmenttype/${appointmentTypeId}`;
		return this.http.get<AppointmentType>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// DELETE => delete the appointmentType from the server
	deleteAppointmentType(appointmentType) {
		const url = `${BaseUrl}api/settings/appointmenttype/${appointmentType.id}`;
		return this.http.delete(url);
	}

	deleteFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the appointmentType on the server
	updateAppointmentType(appointmentType: AppointmentType, appointmentTypeId): Observable<any> {
		const url = `${BaseUrl}api/settings/appointmenttype/${appointmentTypeId}`;
		return this.http.put(url, appointmentType).pipe(
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

}
