import { Injectable } from '@angular/core';

import { mergeMap, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';

import { AppState } from '../../../core/reducers';
// import { allParticipantsLoaded } from '../_selectors/participant.selectors';

import {
    ProviderActionTypes,
    ProviderRegistration,
    ProviderRegistrationComplete,
    ProviderPageToggleLoading,
    ProviderActionToggleLoading
} from '../_actions/provider.actions';
import { ProviderService } from '../../../core/_services';

@Injectable()
export class ProviderEffects {
	showPageLoadingDispatcher = new ProviderPageToggleLoading({ isLoading: true });
	hidePageLoadingDispatcher = new ProviderActionToggleLoading({ isLoading: false });

    @Effect()
	providerRegistration$ = this.actions$
		.pipe(
			ofType<ProviderRegistration>(ProviderActionTypes.ProviderRegistration),
			mergeMap(({ payload }) => {
				const requestToServer = this.auth.registerProvider(payload.provider);
				return forkJoin(requestToServer);
			}),
			map(response => {
				const result: any = response[0];
				return new ProviderRegistrationComplete({
					provider: result.data,
					success: result.success
				});
			}),
		);

	constructor(private actions$: Actions, private auth: ProviderService, private store: Store<AppState>) { 
    }

}
