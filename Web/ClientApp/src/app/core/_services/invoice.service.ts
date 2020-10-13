// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// RxJS
import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, HttpUtilsService } from '../_base/crud';
// Models

import { Invoice } from '../auth/_models/invoice.model';


const API_INVOICE_URL = 'api/myinvoice';

const API_INVOICES_URL = 'api/invoices';


// Invoice APIs


const BaseUrl = environment.BaseURL;


@Injectable()
export class InvoiceService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	createInvoice(Invoice: Invoice): Observable<Invoice> {
		const httpHeaders = new HttpHeaders();
		return this.http.post<Invoice>(BaseUrl + API_INVOICE_URL, Invoice).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getInvoiceById(InvoiceId: number) {
		if (!InvoiceId) {
			return of(null);
		}

		return this.http.get<Invoice>(API_INVOICES_URL + `/${InvoiceId}`);
	}

	deleteInvoice(invoiceId: number) {
		const httpParams = new HttpParams();
		const options = { params: httpParams };
		const url = `${BaseUrl}${API_INVOICE_URL}/${invoiceId}`;
		return this.http.delete(url, options);
	}

	updateInvoice(_Invoice: Invoice): Observable<any> {
		const url = `${BaseUrl}api/myinvoice/${_Invoice.id}`
		return this.http.put(url, _Invoice).pipe(
			mergeMap((response: Invoice[]) => {
				return of(response);
			})
		);
	}


	findInvoices(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const list_invoice = 'api/invoice/list';
		const url = `${BaseUrl + list_invoice}`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				// const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(value);
			})
		);
	}

	generateInvoice(patientId) {
		//  /patient/{patientId}/invoice?format=pdf
		const url = `${BaseUrl}api/patient/${patientId}/invoice?format=pdf`
		this.http.get(url, { responseType: 'blob' }).subscribe((res) => {
			this.saveData(res, 'Invoice for patient.pdf');
		}, err => {
		})
	}

	saveData(data, filename) {
	const a = document.createElement("a");
	document.body.appendChild(a);
	const json = data;
	const	blob = new Blob([json], { type: 'octet/stream' });
	const	url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = filename;
	a.click();
	window.URL.revokeObjectURL(url);
}

	sendInvoice(invoiceId) {
		const url = `${BaseUrl}api/invoice/${invoiceId}/email`;
		// return this.http.get<any>(url).pipe(
		// 	mergeMap((response:any) => {
		// 		return of(response);
		// 	})
		// );
		return this.http.post<any>(url, invoiceId).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getInvoice(id) {
		const url = `${BaseUrl}api/invoice/${id}`
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findBillingType(): Observable<any> {
		const url = `${BaseUrl}api/list/billingType`;
		return this.http.get<any[]>(url).pipe(
			mergeMap(res => {
				return of(res);
			})
		);
	}

	createInvoiceFromAppointment(id) {
		const data = {
			appointmentId: id
		}
		return this.http.post(`${BaseUrl}api/invoice`, data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	createInvoiceFromTimeentry(id) {
		const data = {
			timeentryId: id
		}
		return this.http.post(`${BaseUrl}api/invoice`, data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	downloadFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.get(url, { responseType: 'blob' as 'json' }).pipe(
			catchError(err => {
				return of(null);
			}));
	}

	// sendInvoice(invoiceId): Observable<any> {
	// 	// end email to participant API call will be here.
	// 	const list_invoice = `api/invoice/${invoiceId}/email`;
	// 	const url = `${BaseUrl + list_invoice}`;
	// 	return this.http.post<any[]>(url, invoiceId).pipe(
	// 		mergeMap((response: any) => {
	// 			return of(response);
	// 		})
	// 	);
	// }
}
