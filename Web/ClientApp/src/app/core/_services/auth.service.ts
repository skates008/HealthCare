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
import { User } from '../auth/_models/user.model';
import { Profile } from '../auth/_models/profile.model';
import { Password } from '../auth/_models/password.model';


const API_ACCOUNT_REGISTER_URL = 'api/account/register';
const API_ACCOUNT_LOGIN = 'api/account/login';
const API_LIST_CAREPLAN = 'api/patient/careplan/list';

const BaseUrl = environment.BaseURL;

@Injectable()
export class AuthService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// Authentication/Authorization
	login(userName: string, password: string): Observable<any> {
		const data = {
			userName,
			password
		}
		return this.http.post(BaseUrl + API_ACCOUNT_LOGIN, data);
	}

	register(user): Observable<any> {
		return this.http.post<User>(BaseUrl + API_ACCOUNT_REGISTER_URL, user);
	}

	getIsRegistered() {
		return this.http.get(BaseUrl + 'api/account/isRegistrationComplete');
	}

	requestPassword(data: string): Observable<any> {
		const value = { email: data };
		return this.http.post(BaseUrl + 'api/account/forgotpassword', value).pipe(
			mergeMap(res => {
				const result: any = res;
				return of(result);
			})
		);
	}

	resetPassword(data): Observable<any> {
		return this.http.post(BaseUrl + 'api/account/resetpassword', data).pipe(
			mergeMap(res => {
				const result: any = res;
				return of(result);
			})
		);
	}



	confirmEmail(code): Observable<any> {
		const data = {
			code: code
		}
		const url = `${BaseUrl}api/account/confirmemail`;
		return this.http.post(url, data)
			.pipe(
				map((res) => {
					return res;
				}),
				catchError(err => {
					return null;
				})
			);
	}

	// Profile
	createProfile(Profile: Profile): Observable<Profile> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `api/patient`;
		return this.http.post<Profile>(BaseUrl + url, Profile, { headers: httpHeaders });
	}


	findProfile(queryParams: QueryParamsModel): Observable<any> {
		const url = `${BaseUrl + API_LIST_CAREPLAN}`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}



	getProfileDetails() {
		const url = `${BaseUrl}api/myprofile`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	updateProfile(Profile: any): Observable<any> {
		const url = `${BaseUrl}api/myprofile`;
		return this.http.post(url, Profile).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	updatePassword(Profile: Password): Observable<any> {
		const url = `${BaseUrl}api/account/changepassword`;
		return this.http.post(url, Profile)
	}



	uploadProfileImage(image: any): Observable<any> {
		const url = `${BaseUrl}api/upload/profile`;
		return this.http.post<any>(url, image).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	uploadCompanyLogo(image: any): Observable<any> {
		const url = `${BaseUrl}api/upload/businessprofile`;
		return this.http.post<any>(url, image).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	downloadUserFile(file: any): Observable<any> {
		const url = `${BaseUrl}api/download/userFile`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	deleteUserFile(file: any): Observable<any> {
		const url = `${BaseUrl}api/download/userFile`;
		return this.http.delete(url);
	}


}
