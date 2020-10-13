import { Injectable } from '@angular/core';

import { mergeMap, map, tap } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	InvoiceActionTypes,
	InvoicesPageRequested,
	InvoicesPageLoaded,
	InvoiceCreated,
	InvoiceDeleted,
	GenerateInvoice,
	EmailInvoiceToParticipant,
	GetBillingType,
	InvoiceUpdated,
	GetBillingTypeLoaded,
	InvoiceOnServerCreated,
	InvoicesActionToggleLoading,
	InvoicesPageToggleLoading,
	InvoiceUpdatedResponse
} from '../_actions/invoice.actions';
import { InvoiceService } from '../../../core/_services';

@Injectable()
export class InvoiceEffects {
	showPageLoadingDispatcher = new InvoicesPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new InvoicesPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new InvoicesActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new InvoicesActionToggleLoading({ isLoading: false });

	@Effect()
	loadInvoicesPage$ = this.actions$
		.pipe(
			ofType<InvoicesPageRequested>(InvoiceActionTypes.InvoicesPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findInvoices(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: any = response[0];
				const lastQuery: QueryParamsModel = response[1];
				
				return new InvoicesPageLoaded({
					invoices: result.data,
					total: result.total,
					page: lastQuery
				});
			}),
		);

	@Effect()
	updateInvoice$ = this.actions$
		.pipe(
			ofType<InvoiceUpdated>(InvoiceActionTypes.InvoiceUpdated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.updateInvoice(payload.invoice).pipe(
					tap(res => {
						this.store.dispatch(new InvoiceUpdatedResponse({ invoice: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

		@Effect()
		generateInvoice$ = this.actions$
			.pipe(
				ofType<GenerateInvoice>(InvoiceActionTypes.GenerateInvoice),
				tap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDispatcher);
					return this.auth.generateInvoice(payload.invoice);
				}),
				map(() => {
					return this.hideActionLoadingDispatcher;
				}),
			);

			@Effect()
			sendInvoice$ = this.actions$
			.pipe(
				ofType<EmailInvoiceToParticipant>(InvoiceActionTypes.EmailInvoiceToParticipant),
				tap(({ payload }) => {
					this.store.dispatch(this.showActionLoadingDispatcher);
					return this.auth.sendInvoice(payload.invoice);
				}),
				map(() => {
					return this.hideActionLoadingDispatcher;
				}),
			);

			@Effect()
			getBudgetPageByPatient$ = this.actions$
				.pipe(
					ofType<GetBillingType>(InvoiceActionTypes.GetBillingType),
					mergeMap(({ payload }) => {
					   this.store.dispatch(this.showPageLoadingDispatcher);
						const requestToServer = this.auth.findBillingType();
						return forkJoin(requestToServer);
					}),
					map(response => {
						const result = response[0];
						// const lastQuery: QueryParamsModel = response[1];
						this.store.dispatch(this.showPageLoadingDispatcher);
						return new GetBillingTypeLoaded({
								billing: result.data
							});
					}),
				);

	@Effect()
	createInvoice$ = this.actions$
		.pipe(
			ofType<InvoiceOnServerCreated>(InvoiceActionTypes.InvoiceOnServerCreated),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.createInvoice(payload.invoice).pipe(
					tap(res => {
						this.store.dispatch(new InvoiceCreated({ invoice: res }));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);


	@Effect()
	deleteInvoice$ = this.actions$
		.pipe(
			ofType<InvoiceDeleted>(InvoiceActionTypes.InvoiceDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.deleteInvoice(payload.id);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);

	constructor(private actions$: Actions, private auth: InvoiceService, private store: Store<AppState>) { }

}
