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

import { Budget } from '../auth/_models/budget.model';



const API_LIST_BUDGET = 'api/patient/budgets';
const API_BUDGET_URL = 'api/patient/budget';

const BaseUrl = environment.BaseURL;


@Injectable()
export class BudgetService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	findBudget(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_LIST_BUDGET}`;
		return this.http.get<Budget[]>(BaseUrl + url).pipe(
			mergeMap(res => {
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(res);
			})
		);
	}

	findBudgetByPatient(participant_id): Observable<any> {
		const url = `${BaseUrl}api/list/budget/${participant_id}`;
		return this.http.get<Budget[]>(url).pipe(
			mergeMap(res => {
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(res);
			})
		);
	}

	createBudget(budget: Budget): Observable<any> {
		return this.http.post<Budget>(BaseUrl + API_BUDGET_URL, budget).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		)
	}

	deleteBudget(budgetId: number): Observable<Budget> {
		const httpParams = new HttpParams();
		const options = { params: httpParams };
		const url = BaseUrl + `${API_BUDGET_URL}/${budgetId}`;
		return this.http.delete<Budget>(url);
	}


	updateBudget(budget: any): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_BUDGET_URL, budget, { headers: httpHeader });
	}

	updatedBudgetAmount(budget: any): Observable<any> {
		const tasks$ = [];
		each(budget, element => {
			const _budget = Object.assign({}, element);
			tasks$.push(this.updateBudget(_budget));
		});
		return forkJoin(tasks$);
	}
}
