// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
// Lodash
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models
import { UserNote } from '../auth/_models/userNote.model';
import { Note } from '../auth/_models/note.model';


const API_NOTE_URL = 'api/notes';
const BaseUrl = environment.BaseURL;


@Injectable()
export class NoteService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// UserNotes
	// CREATE =>  POST: add a new userNote to the server
	createUserNote(userNote: UserNote): Observable<UserNote> {
		const url = `${BaseUrl}api/note`;
		return this.http.post<UserNote>(url, userNote);
	}

	// READ
	getAllUserNotes(): Observable<UserNote[]> {
		const url = `${BaseUrl}api/note`;
		const data = {};
		return this.http.post<UserNote[]>(url, data);
	}

	// Filter user notes
	findUserNote(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/note/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	getUserNoteById(userNoteId: string) {
		const url = `${BaseUrl}api/note/${userNoteId}`;
		return this.http.get<UserNote>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// DELETE => delete the userNote from the server
	deleteUserNote(userNoteId: string) {
		const url = `${BaseUrl}api/note/${userNoteId}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the userNote on the server
	updateUserNote(userNote: UserNote): Observable<any> {
		const url = `${BaseUrl}api/note/${userNote.id}`;
		return this.http.put(url, userNote).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUserNotes(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.getAllUserNotes().pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findNote(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_NOTE_URL}`;
		return this.http.get<Note[]>(url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	createNote(note: Note): Observable<Note> {
		const url = `${BaseUrl}api/patient/${note.participant_id}/${note.type}`;
		let data = {};
		if (note.type == "observation") {
			data = {
				Observation: note.text
			}
		}
		else if (note.type == "assessment") {
			data = {
				Assessment: note.text
			}
		}
		else if (note.type == "treatmentNote") {
			data = {
				TreatmentNote: note.text
			}
		}
		return this.http.post<Note>(url, data).pipe(
			mergeMap((response: any) => {
				return of(response.data);
			})
		);
	}


	createAppointmentNote(note: Note): Observable<Note> {
		const url = `${BaseUrl}api/appointment/${note.appointmentId}/${note.type}`;
		// const data = {
		// 	text: note.text
		// }
		let data = {};
		if (note.type == "observation") {
			data = {
				Observation: note.text
			}
		}
		else if (note.type == "assessment") {
			data = {
				Assessment: note.text
			}
		}
		else if (note.type == "treatmentNote") {
			data = {
				TreatmentNote: note.text
			}
		}
		return this.http.post<Note>(url, data).pipe(
			mergeMap((response: any) => {
				return of(response.data);
			})
		);
	}


	createCareplanNote(note: Note): Observable<Note> {
		const url = `${BaseUrl}api/patient/${note.participant_id}/careplan/${note.careplanId}/${note.type}`;
		// const data = {
		// 	text: note.text
		// }
		let data = {};
		if (note.type == "observation") {
			data = {
				Observation: note.text
			}
		}
		else if (note.type == "assessment") {
			data = {
				Assessment: note.text
			}
		}
		else if (note.type == "treatmentNote") {
			data = {
				TreatmentNote: note.text
			}
		}
		return this.http.post<Note>(url, data).pipe(
			mergeMap((response: any) => {
				return of(response.data);
			})
		);
	}

	addInternalNote(id, data) {
		const url = `${BaseUrl}api/appointment/${id}/action`;
		return this.http.post(url, data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);

	}

	// findNotificationByParticipant(queryParams: QueryParamsModel, participant_id): Observable<any> {
	// 	// This code imitates server calls
	// 	const url = `${API_NOTIFICATION_URL}`;
	// 	return this.http.get<Notification[]>(url).pipe(
	// 		mergeMap(res => {
	// 			res = res.filter(item => item.participant_id == participant_id);
	// 			const result = this.httpUtils.baseFilter(res, queryParams, []);
	// 			return of(result);
	// 		})
	// 	);
	// }

}
