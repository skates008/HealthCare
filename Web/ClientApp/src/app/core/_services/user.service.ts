// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// RxJS
import { Observable, of } from 'rxjs';
// Lodash
import { mergeMap } from 'rxjs/operators';
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models
import { User } from './../auth/_models/user.model';


const BaseUrl = environment.BaseURL;


@Injectable()
export class UserService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// Users

	// CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<User> {
		const url = `${BaseUrl}api/usermanagement/user`;
		return this.http.post<User>(url, user);
	}

	// READ
	getAllUsers(): Observable<User[]> {
		const url = `${BaseUrl}api/usermanagement/user/list`;
		const data = {};
		return this.http.post<User[]>(url, data);
	}

	//
	findUser(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/usermanagement/user/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(res);
			})
		);
	}

	getUserById(userId: string): Observable<User> {
		if (!userId) {
			return of(null);
		}
		const url = `${BaseUrl}api/usermanagement/user/${userId}`
		const data = {};
		return this.http.get<User>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// DELETE => delete the user from the server
	deleteUser(userId: number) {
		const url = `${BaseUrl}api/usermanagement/user/${userId}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the user on the server
	updateUser(_user: User): Observable<any> {
		const url = `${BaseUrl}api/usermanagement/user/${_user.id}`;
		return this.http.put(url, _user).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.getAllUsers().pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}
}
