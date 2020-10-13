import { Injectable } from '@angular/core';

import { mergeMap, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import { allCompanysLoaded } from '../_selectors/company.selectors';

import {
	AllCompanysLoaded,
	CompanyActionTypes,
	AllCompanysRequested,
	CompanysPageRequested,
	CompanysPageLoaded,
	CompanyCreated,
	CompanyDeleted,
	CompanyUpdated,
	CompanyOnServerCreated,
	CompanysActionToggleLoading,
	CompanysPageToggleLoading,
	GetCompanyById,
	CompanyByIdLoaded,
	InitRegistration,
	InitRegristrationLoaded,
	RegistrationComplete,
	RegistrationCompleteLoaded,
	CompanyEditPageLoaded,
	CompanyEditPageRequested,
	CompanyProfilePageRequested,
	CompanyProfilePageLoaded,
	CompanyUpdatedResponse
} from '../_actions/company.actions';
import { CompanyService, AuthService, ParticipantService } from '../../../core/_services';

@Injectable()
export class CompanyEffects {
	showPageLoadingDispatcher = new CompanysPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new CompanysPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new CompanysActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new CompanysActionToggleLoading({ isLoading: false });

	@Effect()
	loadAllCompanys$ = this.actions$
		.pipe(
			ofType<AllCompanysRequested>(CompanyActionTypes.AllCompanysRequested),
			withLatestFrom(this.store.pipe(select(allCompanysLoaded))),
			filter(([action, isAllCompanysLoaded]) => !isAllCompanysLoaded),
			mergeMap(() => this.company.getAllCompanys()),
			map(companys => {
				return new AllCompanysLoaded({ companys });
			})
		);

	@Effect()
	loadCompanysPage$ = this.actions$
		.pipe(
			ofType<CompanysPageRequested>(CompanyActionTypes.CompanysPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.company.findCompany(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];
				return new CompanysPageLoaded({
					companys: result.items,
					total: result.total,
					success: result.success,
					page: lastQuery
				});
			}),
		);

		@Effect()
		updateCompanyPage$ = this.actions$
			.pipe(
				ofType<CompanyUpdated>(CompanyActionTypes.CompanyUpdated),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.company.updateCompany(payload.company);
					// const lastQuery = of(payload.page);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					// const lastQuery: QueryParamsModel = response[1];
					return new CompanyUpdatedResponse({
						company: result,
					});
				}),
			);

	@Effect()
	deleteCompany$ = this.actions$
		.pipe(
			ofType<CompanyDeleted>(CompanyActionTypes.CompanyDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.company.deleteCompany(payload.id);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);


		@Effect()
		createCompany$ = this.actions$
			.pipe(
				ofType<CompanyOnServerCreated>(CompanyActionTypes.CompanyOnServerCreated),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.company.createCompany(payload.company);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result: any = response[0];
					return new CompanyCreated({
			             company: result
					});
				}),
			);



			@Effect()
			initRegistrationData$ = this.actions$
				.pipe(
					ofType<InitRegistration>(CompanyActionTypes.InitRegistration),
					mergeMap(({payload}) => {
						this.store.dispatch(this.showPageLoadingDispatcher);
						const requestToServer = this.participant.getInitRegistration(payload.company);
						return forkJoin(requestToServer);
					}),
					map(response => {
						const result = response[0];
						return new InitRegristrationLoaded({
							company: result.data
						});
					}),
				);

				@Effect()
				registrationComplete$ = this.actions$
					.pipe(
						ofType<RegistrationComplete>(CompanyActionTypes.RegistrationComplete),
						mergeMap(({payload}) => {
							this.store.dispatch(this.showPageLoadingDispatcher);
							const requestToServer = this.participant.postRegistartionData(payload.registrationData);
							return forkJoin(requestToServer);
						}),
						map(response => {
							const result = response[0];
							return new RegistrationCompleteLoaded({
								registrationCompleteData: result.data,
								success:result.success
							});
						}),
					);

					@Effect()
					loadCompanyProfilePage$ = this.actions$
						.pipe(
							ofType<CompanyProfilePageRequested>(CompanyActionTypes.CompanyProfilePageRequested),
							mergeMap(({ payload }) => {
								this.store.dispatch(this.showPageLoadingDispatcher);
								const requestToServer = this.company.getCompanysProfile();
								return forkJoin(requestToServer);
							}),
							map(response => {
								const result = response[0];
								// const lastQuery: QueryParamsModel = response[1];
								return new CompanyProfilePageLoaded({
									company: result.data,
									total: result.total,
									success: result.success,
								});
							}),
						);


				@Effect()
				init$: Observable<Action> = defer(() => {
				return of(new AllCompanysRequested());
				});
	constructor(private actions$: Actions,
		private company: CompanyService,
		private auth: AuthService,
		private participant: ParticipantService,
		private store: Store<AppState>) { }

}
