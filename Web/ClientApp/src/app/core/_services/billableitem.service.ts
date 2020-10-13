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


import { BillableItem } from '../auth/_models/billableItem.model';
const API_BILLABLEITEMS_URL = 'api/billableItem';


const BaseUrl = environment.BaseURL;


@Injectable()
export class BillableitemService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	createBillableItem(BillableItem: BillableItem): Observable<any> {
		const url = `${BaseUrl}${API_BILLABLEITEMS_URL}`
		return this.http.post<BillableItem>(url, BillableItem).pipe(
			mergeMap((response) => {
				return of(response);
			})
		);
	}

	getAllBillableItems(): Observable<BillableItem[]> {
		const data = {};
		return this.http.post<BillableItem[]>(BaseUrl + 'api/billableItem/list', data);
	}

	getBillableItemById(BillableItemId: string): Observable<any> {
		if (!BillableItemId) {
			return of(null);
		}
		const url = `${BaseUrl}api/billableItem/${BillableItemId}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response) => {
				return of(response);
			})
		);
	}

	deleteBillableItem(BillableItemId) {
		const url = `${BaseUrl}api/billableItem/${BillableItemId}`;
		return this.http.delete(url);
	}



	updateBillableItem(_BillableItem: BillableItem): Observable<any> {
		return this.http.put(BaseUrl + API_BILLABLEITEMS_URL + "/" + _BillableItem.id, _BillableItem).pipe(
			mergeMap((response) => {
				return of(response);
				// const result = this.httpUtils.baseFilter(response, queryParams, []);

			})
		);
	}

	// findBillableItems(queryParams: QueryParamsModel): Observable<any> {
	// 	return this.getAllBillableItems().pipe(
	// 		mergeMap((response) => {
	// 			return of(response);
	// 			// const result = this.httpUtils.baseFilter(response, queryParams, []);

	// 		})
	// 	);
	// }

	findBillableItems(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const list_billable = 'api/billableItem/list';
		const url = `${BaseUrl + list_billable}`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	findBillableItemsTimes(): Observable<any> {
		return this.http.get<any>(BaseUrl + 'api/list/billableitems').pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

}
