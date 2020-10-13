import { Injectable } from '@angular/core';

import { mergeMap, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../../core/reducers';
import { allParticipantsLoaded } from '../_selectors/participant.selectors';

import {
	AllParticipantsLoaded,
	ParticipantActionTypes,
	AllParticipantsRequested,
	ParticipantsPageRequested,
	CareplanParticipantsPageRequested,
	ParticipantsPageLoaded,
	ParticipantCreated,
	ParticipantDeleted,
	ParticipantUpdated,
	ParticipantOnServerCreated,
	ParticipantsActionToggleLoading,
	ParticipantsPageToggleLoading,
	GetParticipantById,
	ParticipantByIdLoaded,
	InitRegistration,
	InitRegristrationLoaded,
	RegistrationComplete,
	RegistrationCompleteLoaded,
	ParticipantEditPageLoaded,
	ParticipantEditPageRequested,
	ParticipantProfilePageRequested,
	ParticipantProfilePageLoaded,
	ParticipantUpdatedResponse
} from '../_actions/participant.actions';
import { ParticipantService } from '../../../core/_services';

@Injectable()
export class ParticipantEffects {
	showPageLoadingDispatcher = new ParticipantsPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new ParticipantsPageToggleLoading({ isLoading: false });

	showActionLoadingDispatcher = new ParticipantsActionToggleLoading({ isLoading: true });
	hideActionLoadingDispatcher = new ParticipantsActionToggleLoading({ isLoading: false });

	@Effect()
	loadAllParticipants$ = this.actions$
		.pipe(
			ofType<AllParticipantsRequested>(ParticipantActionTypes.AllParticipantsRequested),
			withLatestFrom(this.store.pipe(select(allParticipantsLoaded))),
			filter(([action, isAllParticipantsLoaded]) => !isAllParticipantsLoaded),
			mergeMap(() => this.auth.getAllParticipants()),
			map(participants => {
				return new AllParticipantsLoaded({ participants });
			})
		);

	@Effect()
	loadParticipantsPage$ = this.actions$
		.pipe(
			ofType<ParticipantsPageRequested>(ParticipantActionTypes.ParticipantsPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findParticipant(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new ParticipantsPageLoaded({
					participants: result.data,
					total: result.total,
					success: result.success,
					page: lastQuery
				});
			}),
		);

	@Effect()
	loadCareplanParticipantsPage$ = this.actions$
		.pipe(
			ofType<CareplanParticipantsPageRequested>(ParticipantActionTypes.CareplanParticipantsPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findCareplanParticipant(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];
				return new ParticipantsPageLoaded({
					participants: result.items,
					total: result.total,
					success: result.success,
					page: lastQuery
				});
			}),
		);

		@Effect()
		updateParticipantPage$ = this.actions$
			.pipe(
				ofType<ParticipantUpdated>(ParticipantActionTypes.ParticipantUpdated),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.auth.updateParticipant(payload.participant);
					// const lastQuery = of(payload.page);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result = response[0];
					// const lastQuery: QueryParamsModel = response[1];
					return new ParticipantUpdatedResponse({
						participant: result,
					});
				}),
			);

	@Effect()
	deleteParticipant$ = this.actions$
		.pipe(
			ofType<ParticipantDeleted>(ParticipantActionTypes.ParticipantDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDispatcher);
				return this.auth.deleteParticipant(payload.id);
			}),
			map(() => {
				return this.hideActionLoadingDispatcher;
			}),
		);


		@Effect()
		createParticipant$ = this.actions$
			.pipe(
				ofType<ParticipantOnServerCreated>(ParticipantActionTypes.ParticipantOnServerCreated),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.auth.createParticipant(payload.participant);
					return forkJoin(requestToServer);
				}),
				map(response => {
					const result: any = response[0];
					return new ParticipantCreated({
			             participant: result
					});
				}),
			);



		@Effect()
		getParticipantById$ = this.actions$
			.pipe(
				ofType<GetParticipantById>(ParticipantActionTypes.GetParticipantById),
				mergeMap(({ payload }) => {
					this.store.dispatch(this.showPageLoadingDispatcher);
					const requestToServer = this.auth.getParticipantById(payload.participant_id);
					const lastQuery = of(payload.participant_id);
					return forkJoin(requestToServer, lastQuery);
				}),
				map(response => {
					const result = response[0];
					return new ParticipantByIdLoaded({
						participant: result.data
					});
				}),
			);

			@Effect()
			initRegistrationData$ = this.actions$
				.pipe(
					ofType<InitRegistration>(ParticipantActionTypes.InitRegistration),
					mergeMap(({payload}) => {
						this.store.dispatch(this.showPageLoadingDispatcher);
						const requestToServer = this.auth.getInitRegistration(payload.participant);
						return forkJoin(requestToServer);
					}),
					map(response => {
						const result = response[0];
						return new InitRegristrationLoaded({
							participant: result.data
						});
					}),
				);

				@Effect()
				registrationComplete$ = this.actions$
					.pipe(
						ofType<RegistrationComplete>(ParticipantActionTypes.RegistrationComplete),
						mergeMap(({payload}) => {
							this.store.dispatch(this.showPageLoadingDispatcher);
							const requestToServer = this.auth.postRegistartionData(payload.registrationData);
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


				//participant edit Page
				@Effect()
				loadParticipantEditPage$ = this.actions$
					.pipe(
						ofType<ParticipantEditPageRequested>(ParticipantActionTypes.ParticipantEditPageRequested),
						mergeMap(({ payload }) => {
							this.store.dispatch(this.showPageLoadingDispatcher);
							const requestToServer = this.auth.getParticipantEditList(payload.participantId);
							const lastQuery = of(payload.participantId);
							return forkJoin(requestToServer, lastQuery);
						}),
						map(response => {
							const result = response[0];
							return new ParticipantEditPageLoaded({
								participants: result.data,
								success: result.success
							});
						}),
					);

					@Effect()
					loadParticipantProfilePage$ = this.actions$
						.pipe(
							ofType<ParticipantProfilePageRequested>(ParticipantActionTypes.ParticipantProfilePageRequested),
							mergeMap(({ payload }) => {
								this.store.dispatch(this.showPageLoadingDispatcher);
								const requestToServer = this.auth.getParticipantsProfile();
								return forkJoin(requestToServer);
							}),
							map(response => {
								const result = response[0];
								// const lastQuery: QueryParamsModel = response[1];
								return new ParticipantProfilePageLoaded({
									participant: result.data,
									total: result.total,
									success: result.success,
								});
							}),
						);


				@Effect()
				init$: Observable<Action> = defer(() => {
				return of(new AllParticipantsRequested());
				});
	constructor(private actions$: Actions, private auth: ParticipantService, private store: Store<AppState>) { }

}
