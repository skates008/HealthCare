import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Provider } from '../_models/provider.model';

import { QueryParamsModel } from '../../_base/crud';

export enum ProviderActionTypes {
    ProviderPageToggleLoading = '[Provider] Participants Page Toggle Loading',
    ProviderActionToggleLoading = '[Provider] Participants Action Toggle Loading',
    ProviderRegistration = '[Welcome Provider Component] Register for Provider',
    ProviderRegistrationComplete = '[Welcome Provider Component] Register For Provider Completed'

}
 
export class ProviderPageToggleLoading implements Action {
	readonly type = ProviderActionTypes.ProviderPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}
export class ProviderActionToggleLoading implements Action {
	readonly type = ProviderActionTypes.ProviderActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class ProviderRegistration implements Action {
	readonly type = ProviderActionTypes.ProviderRegistration;
	constructor(public payload: { provider: Provider }) {
     }
}

export class ProviderRegistrationComplete implements Action {
	readonly type = ProviderActionTypes.ProviderRegistrationComplete;
	constructor(public payload: { provider:any, success: boolean }) {
     }
}


export type ProviderActions = 
ProviderPageToggleLoading
|ProviderActionToggleLoading
|ProviderRegistration
|ProviderRegistrationComplete;

