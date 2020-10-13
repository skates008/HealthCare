import { Injectable } from '@angular/core';

import { mergeMap, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../../core/reducers';
// import { allParticipantsLoaded } from '../_selectors/participant.selectors';

import {
	AllPractitionerLoaded,
	PractitionerActionTypes,
	AllPractitionerRequested,
	PractitionerPageRequested,
	PractitionerPageLoaded,
	PractitionerPageToggleLoading
} from '../_actions/practitioner.actions';
import { PractitionerService } from '../../../core/_services';

@Injectable()
export class PractitionerEffects {
	showPageLoadingDispatcher = new PractitionerPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new PractitionerPageToggleLoading({ isLoading: false });

	// showActionLoadingDispatcher = new ParticipantsActionToggleLoading({ isLoading: true });
	// hideActionLoadingDispatcher = new ParticipantsActionToggleLoading({ isLoading: false });

	// @Effect()
	// loadAllPractitioner$ = this.actions$
	// 	.pipe(
	// 		ofType<AllPractitionerRequested>(PractitonerActionTypes.AllPractitionerRequested),
	// 		withLatestFrom(this.store.pipe(select(allPractitionerLoaded))),
	// 		filter(([action, isAllParticipantsLoaded]) => !isAllParticipantsLoaded),
	// 		mergeMap(() => this.auth.getAllParticipants()),
	// 		map(participants => {
	// 			return new AllPractitionerLoaded({ practitioner });
	// 		})
	// 	);

	@Effect()
	loadPractitionerPage$ = this.actions$
		.pipe(
			ofType<PractitionerPageRequested>(PractitionerActionTypes.PractitionerPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDispatcher);
				const requestToServer = this.auth.findPractitioner(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result = response[0];
				const lastQuery: QueryParamsModel = response[1];

				return new PractitionerPageLoaded({
					practitioner: result,
					total: result.length,
					page: lastQuery
				});
			}),
		);

	@Effect()
	init$: Observable<Action> = defer(() => {
		return of(new AllPractitionerRequested());
	});
	constructor(private actions$: Actions, private auth: PractitionerService, private store: Store<AppState>) { }

}
