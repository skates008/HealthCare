import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Practitioner } from '../_models/practitioner.model';

import { QueryParamsModel } from '../../_base/crud';

export enum PractitionerActionTypes {
	AllPractitionerRequested = '[Practitioner Module] All Practitioner Requested',
	AllPractitionerLoaded = '[Practitioner API] All Practitioner Loaded',
	PractitionerPageRequested = '[Practitioner List Page] Practitioner Page Requested',
	PractitionerPageLoaded = '[Practitioner API] Practitioner Page Loaded',
	PractitionerPageToggleLoading = '[Practitioner] Practitioner Page Toggle Loading',
	PractitionerActionToggleLoading = '[Practitioner] Practitioner Action Toggle Loading'
}

export class  PractitionerPageRequested implements Action {
	readonly type = PractitionerActionTypes.PractitionerPageRequested;
	constructor(public payload: { page: QueryParamsModel}) {

	 }
}

export class PractitionerPageLoaded implements Action {
	readonly type = PractitionerActionTypes.PractitionerPageLoaded;
	constructor(public payload: { practitioner: any, total: number, page: QueryParamsModel }) {
	 }
}

export class AllPractitionerLoaded implements Action {
	readonly type = PractitionerActionTypes.AllPractitionerLoaded;
	constructor(public payload: { practitioner: any }) { }
}

export class PractitionerPageToggleLoading implements Action {
	readonly type = PractitionerActionTypes.PractitionerPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class AllPractitionerRequested implements Action {
	readonly type = PractitionerActionTypes.AllPractitionerRequested;
}


export type PractitionerActions =
| PractitionerPageRequested
| PractitionerPageLoaded
| AllPractitionerLoaded
| PractitionerPageRequested
| AllPractitionerRequested
| PractitionerPageToggleLoading;
