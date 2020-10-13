// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable, of } from 'rxjs';
import {  mergeMap } from 'rxjs/operators';
// Lodash
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models

import { Participant } from '../auth/_models/participant.model';


const BaseUrl = environment.BaseURL;
const API_CREATE_PATIENT = 'api/patient';
const API_PATIENTS_URL = 'api/patient/list';


@Injectable()
export class ParticipantService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	createParticipant(participant: Participant): Observable<Participant> {
		return this.http.post<Participant>(BaseUrl + API_CREATE_PATIENT, participant).pipe(
			mergeMap(response => {
				return of(response);
			})
		);
	}

	findParticipant(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + API_PATIENTS_URL, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	findCareplanParticipant(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + 'api/careplan/patient/list', queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	findParticipants(queryParams: QueryParamsModel): Observable<any> {
		return this.getAllParticipants().pipe(
			mergeMap((response: any) => {
				// const result = this.httpUtils.baseFilter(response.data, queryParams, []);
				return of(response);
			})
		);
	}

	getAllParticipants(): Observable<Participant[]> {
		const data = {};
		return this.http.post<Participant[]>(BaseUrl + API_PATIENTS_URL, data);
	}

	getParticipantById(participantId: string) {
		if (!participantId) {
			return of(null);
		}
		const url = `${BaseUrl}api/patient/${participantId}/details`;

		return this.http.get<Participant>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	getParticipantEditList(participantId: string) {
		if (!participantId) {
			return of(null);
		}
		const url = `${BaseUrl}api/patient/${participantId}`;

		return this.http.get<Participant>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getParticipantsProfile() {
		const url = `${BaseUrl}api/patient/myprofile`;
		return this.http.get<Participant>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	updateParticipant(_participant: Participant): Observable<any> {
		const url = `${BaseUrl}api/patient/${_participant.id}`;
		return this.http.put(url, _participant).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	deleteParticipant(participantId) {
		const url = `${BaseUrl}api/patient/${participantId}`;
		return this.http.delete(url);
	}

	// registration Participant
	getInitRegistration(participant: any) {
		const url = `${BaseUrl}api/patient/initRegistration`;
		return this.http.post<Participant>(url, {})
			.pipe(
				mergeMap((response: any) => {
					return of(response);
				})
			);
	}

	postRegistartionData(registrationData: any) {
		const url = `${BaseUrl}api/patient/registrationComplete`;
		return this.http.post<Participant>(url, registrationData).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);

	}

	listParticipant() {
		return this.http.get(BaseUrl + 'api/list/participant');
	}

	getPatientAddressList(participantId){
		const url = `${BaseUrl}api/list/addresstype/${participantId}`;
		return this.http.get<any>(url);
	}
}
