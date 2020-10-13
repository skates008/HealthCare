// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// RxJS
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models

import { Task } from '../auth/_models/task.model';

const API_TASK_URL = 'api/mytask';
const API_TASKS_URL = 'api/tasks';
const API_LIST_TASK = 'api/mytask/list';


const BaseUrl = environment.BaseURL;


@Injectable()
export class TaskService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// tasks
	createTask(Task: Task): Observable<Task> {
		const httpHeaders = new HttpHeaders();
		return this.http.post<Task>(BaseUrl + API_TASK_URL, Task).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getAllTasks(): Observable<Task[]> {
		const data = {}
		return this.http.post<Task[]>(BaseUrl + API_LIST_TASK, {});
	}

	findTask(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + API_LIST_TASK, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	getTaskById(TaskId: number) {
		if (!TaskId) {
			return of(null);
		}

		return this.http.get<Task>(API_TASKS_URL + `/${TaskId}`);
	}

	deleteTask(taskId: number) {
		const httpParams = new HttpParams();
		const options = { params: httpParams };
		const url = `${BaseUrl}${API_TASK_URL}/${taskId}`;
		return this.http.delete(url, options);
	}

	updateTask(_Task: Task): Observable<any> {
		const url = `${BaseUrl}api/mytask/${_Task.id}`
		return this.http.put(url, _Task).pipe(
			mergeMap((response: Task[]) => {
				return of(response);
			})
		);
	}

	findTasks(queryParams: QueryParamsModel): Observable<any> {
		return this.getAllTasks().pipe(
			mergeMap((response: Task[]) => {
				return of(response);
			})
		);
	}
}
