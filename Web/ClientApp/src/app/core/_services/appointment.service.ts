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

import { Appointment } from '../auth/_models/appointment.model';



const API_LIST_APPOINTMENT = 'api/appointment/list';
const API_APPOINTMENT_URL = 'api/appointments';
const API_CREATE_APPOINMENT = 'api/appointment';


const API_APPOINTMENT_ARCHIVED_URL = 'api/appointments/archived';

const API_UPCOMING_APPOINTMENT = 'api/appointment/list/upcoming';


const BaseUrl = environment.BaseURL;


@Injectable()
export class AppointmentService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	createAppointment(appointment: Appointment): Observable<Appointment> {
		return this.http.post<Appointment>(BaseUrl + API_CREATE_APPOINMENT, appointment).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// UPDATE => PUT: update the appointment on the server
	updateAppointment(appointment: Appointment): Observable<any> {
		return this.http.put(BaseUrl + API_CREATE_APPOINMENT + '/' + appointment.id, appointment);
	}



	findAppointments(queryParams: QueryParamsModel, appointmentParams): Observable<any> {
		return this.http.post<Appointment[]>(BaseUrl + API_LIST_APPOINTMENT, appointmentParams)
			.pipe(
				mergeMap((response: Appointment[]) => {
					return of(response);
				})

			);
	}


	findUpcomingAppointments(): Observable<any> {
		const data = {};
		return this.http.post<Appointment[]>(BaseUrl + API_UPCOMING_APPOINTMENT, data)
			.pipe(
				mergeMap((response) => {
					return of(response);
				})

			);
	}



	// DELETE => delete the appointment from the server
	deleteAppointment(appointmentId: number): Observable<Appointment> {
		const url = `${API_APPOINTMENT_URL}/${appointmentId}`;
		return this.http.delete<Appointment>(url);
	}

	// Cancel => delete the appointment from the server
	cancelAppointment(id: any, cancelData: any): Observable<any> {
		const url = `${BaseUrl}api/appointment/${id}/action`;
		return this.http.post<any>(url, cancelData).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	apptAction(id: any, data: any): Observable<any> {
		const url = `${BaseUrl}api/appointment/${id}/action`;
		return this.http.post<any>(url, data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getAppointmentById(id) {
		const url = `${BaseUrl}api/appointment/${id}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(response);
			})
		);
	}



	// // finalize => delete the appointment from the server
	finalizeAppointment(id: any, finalizeData: any): Observable<any> {
		const url = `${BaseUrl}api/appointment/${id}/action`;
		return this.http.post(url, finalizeData).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	// archived appointments //not used
	archiveAppointment(archivedappointments: Appointment): Observable<Appointment> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `${API_APPOINTMENT_URL}`;
		return this.http.post<Appointment>(API_APPOINTMENT_ARCHIVED_URL, archivedappointments, { headers: httpHeaders });
	}

	// add assessment in appointments
	addAssessment(assessment: Appointment): Observable<Appointment> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put<Appointment>(API_APPOINTMENT_URL, assessment, { headers: httpHeaders });
	}

	// add assessment in appointments
	addObservation(observation: Appointment): Observable<Appointment> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put<Appointment>(API_APPOINTMENT_URL, observation, { headers: httpHeaders });
	}

	eventsTimeline(param): Observable<any> {
		const url = `${BaseUrl}api/appointment/list/timelineview`;
		return this.http.post<any>(url, param).pipe(
			map((res) => {
				return res;
			}),
			catchError(err => {
				return null;
			})
		);
	}

	listAppointmentType(): Observable<any> {
		return this.http.get(`${BaseUrl}api/list/appointmentType`);
	}

	getAppointmentDetails(id) {
		return this.http.get(`${BaseUrl}api/appointment/${id}/details`).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	
	loadGridViewAppointments(params): Observable<any> {
		console.log("params", params);
		const url = `${BaseUrl}api/appointment/list/gridview`;
		return this.http.post<any[]>(url, params).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}
}
