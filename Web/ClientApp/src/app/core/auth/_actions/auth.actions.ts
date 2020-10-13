import { Action } from '@ngrx/store';
import { User } from '../_models/user.model';
import { Participant } from '../_models/participant.model';
import { BillableItem } from '../_models/billableItem.model';
import { TherapyService } from '../_models/therapyService.model';
import { Time } from '../_models/time.model';
import { Task } from '../_models/task.model';
import { Team } from '../_models/team.model';
import { Invoice } from '../_models/invoice.model';
import { Careplan } from '../_models/careplan.model';

export enum AuthActionTypes {
	Login = '[Login] Action',
	Logout = '[Logout] Action',
	Register = '[Register] Action',
	UserRequested = '[Request User] Action',
	UserLoaded = '[Load User] Auth API',
	ParticipantRequested = '[Request User] Action',
	ParticipantLoaded = '[Load Participant] Auth API',
	BillableItemRequested = '[Request User] Action',
	BillableItemLoaded = '[Load BillableItem] Auth API',
	TherapyServiceRequested = '[Request User] Action',
	TherapyServiceLoaded = '[Load TherapyService] Auth API',
	TimeRequested = '[Request User] Action',
	TimeLoaded = '[Load Time] Auth API',
	TaskRequested = '[Request User] Action',
	TaskLoaded = '[Load Task] Auth API',
	TeamRequested = '[Request Team] Action',
	TeamLoaded = '[Load Team] Auth API',
	InvoiceRequested = '[Request User] Action',
	InvoiceLoaded = '[Load Invoice] Auth API',
	CareplanRequested = '[Request User] Action',
	CareplanLoaded = '[Load Careplan] Auth API'
}

export class Login implements Action {
	readonly type = AuthActionTypes.Login;
	constructor(public payload: { authToken: string }) { }
}

export class Logout implements Action {
	readonly type = AuthActionTypes.Logout;
}

export class Register implements Action {
	readonly type = AuthActionTypes.Register;
	constructor(public payload: { authToken: string }) { }
}


export class UserRequested implements Action {
	readonly type = AuthActionTypes.UserRequested;
}

export class UserLoaded implements Action {
	readonly type = AuthActionTypes.UserLoaded;
	constructor(public payload: { user: any }) { }
}

export class ParticipantRequested implements Action {
	readonly type = AuthActionTypes.ParticipantRequested;
}

export class ParticipantLoaded implements Action {
	readonly type = AuthActionTypes.ParticipantLoaded;
	constructor(public payload: { participant: Participant }) { }
}

export class BillableItemRequested implements Action {
	readonly type = AuthActionTypes.BillableItemRequested;
}

export class BillableItemLoaded implements Action {
	readonly type = AuthActionTypes.BillableItemLoaded;
	constructor(public payload: { billableItem: BillableItem }) { }
}

export class TherapyServiceRequested implements Action {
	readonly type = AuthActionTypes.TherapyServiceRequested;
}

export class TherapyServiceLoaded implements Action {
	readonly type = AuthActionTypes.TherapyServiceLoaded;
	constructor(public payload: { therapyService: TherapyService }) { }
}

export class TimeRequested implements Action {
	readonly type = AuthActionTypes.TimeRequested;
}

export class TimeLoaded implements Action {
	readonly type = AuthActionTypes.TimeLoaded;
	constructor(public payload: { time: Time }) { }
}

export class TaskRequested implements Action {
	readonly type = AuthActionTypes.TaskRequested;
}

export class TaskLoaded implements Action {
	readonly type = AuthActionTypes.TaskLoaded;
	constructor(public payload: { task: Task }) { }
}

export class TeamRequested implements Action {
	readonly type = AuthActionTypes.TeamRequested;
}

export class TeamLoaded implements Action {
	readonly type = AuthActionTypes.TeamLoaded;
	constructor(public payload: { team: Team }) { }
}


export class InvoiceRequested implements Action {
	readonly type = AuthActionTypes.InvoiceRequested;
}

export class InvoiceLoaded implements Action {
	readonly type = AuthActionTypes.InvoiceLoaded;
	constructor(public payload: { invoice: Invoice }) { }
}

export class CareplanRequested implements Action {
	readonly type = AuthActionTypes.CareplanRequested;
}

export class CareplanLoaded implements Action {
	readonly type = AuthActionTypes.CareplanLoaded;
	constructor(public payload: { careplan: Careplan }) { }
}

export type AuthActions = Login | Logout | Register | UserRequested | UserLoaded | ParticipantRequested | ParticipantLoaded | TimeRequested | TimeLoaded ;
