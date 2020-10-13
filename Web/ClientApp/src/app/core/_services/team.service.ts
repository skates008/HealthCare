// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// RxJS
import { Observable, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models
import { Team } from '../auth/_models/team.model';



const API_LIST_TEAM = 'api/team/list';
const API_TEAMS_URL = 'api/team';


const BaseUrl = environment.BaseURL;


@Injectable()
export class TeamService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	createTeam(Team: Team): Observable<Team> {
		return this.http.post<Team>(BaseUrl + API_TEAMS_URL, Team).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findTeam(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + API_LIST_TEAM, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	getAllTeams(): Observable<Team[]> {
		const data = {}
		return this.http.get<Team[]>(BaseUrl + API_TEAMS_URL);
	}

	getTeamById(TeamId: number) {
		if (!TeamId) {
			return of(null);
		}

		return this.http.get<Team>(API_TEAMS_URL + `/${TeamId}`);
	}

	deleteTeam(teamId: number) {
		const httpParams = new HttpParams();
		const options = { params: httpParams };
		const url = `${BaseUrl}${API_TEAMS_URL}/${teamId}`;
		return this.http.delete(url, options);
	}

	updateTeam(_Team: Team): Observable<any> {
		const url = `${BaseUrl}${API_TEAMS_URL}/${_Team.id}`;
		return this.http.put(url, _Team).pipe(
			mergeMap((response: Team[]) => {
				return of(response);
			})
		);
	}

	listTeamUsers(): Observable<any> {
		const url = `${BaseUrl}api/team/list/users`;
		return this.http.get<any>(url, {}).pipe(
			map((res) => {
				return res;
			}),
			catchError(err => {
				return null;
			})
		);
	}
}
