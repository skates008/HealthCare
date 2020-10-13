// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { map, catchError } from 'rxjs/operators';
// Lodash
// Environment
// CRUD
import {  HttpUtilsService } from '../_base/crud';
// Models



@Injectable()
export class UtilService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	addressAutoSuggest(searchString) {
		const httpHeaders = new HttpHeaders();
		// httpHeaders.set('Access-Control-Allow-Origin', 'http://localhost:4200/');
		// httpHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
		// httpHeaders.set("Access-Control-Allow-Headers", "Authorization");
		const url = `https://dev.virtualearth.net/REST/v1/Autosuggest?query=${searchString}
		&includeEntityTypes=Address&countryFilter=AU&key=AmQIY_diE2SJ9WbHyni90fNy9bIIAtEKwFImQQ7MHxSOm61_L5AheC3COw9FwgcN&jsonp=JSONP_CALLBACK`;
		return this.http.jsonp(url, 'JSONP_CALLBACK').pipe(
			map((res: any) => {
				return res;
			}),
			catchError(err => {
				return null;
			})
		);
	}
}
