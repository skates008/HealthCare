import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Company } from '../_models/company.model';

import { QueryParamsModel } from '../../_base/crud';

export enum CompanyActionTypes {
	AllCompanysRequested = '[Companys Module] All Companys Requested',
	AllCompanysLoaded = '[Companys API] All Companys Loaded',
	CompanyOnServerCreated = '[Edit Company Component] Company On Server Created',
	CompanyCreated = '[Edit Company Dialog] Company Created',
	CompanyUpdated = '[Edit Company Dialog] Company Updated',
	CompanyDeleted = '[Companys List Page] Company Deleted',
	CompanysPageRequested = '[Companys List Page] Companys Page Requested',
	CompanysPageLoaded = '[Companys API] Companys Page Loaded',
	CompanysPageCancelled = '[Companys API] Companys Page Cancelled',
	CompanysPageToggleLoading = '[Companys] Companys Page Toggle Loading',
	CompanysActionToggleLoading = '[Companys] Companys Action Toggle Loading',
	GetCompanyById = '[ Company Profile] Get Company By Id',
	CompanyByIdLoaded ='[Company Id] Company By Id Loaded',
	InitRegistration = '[Init Registration] Company Registration Data',
	InitRegristrationLoaded = '[Init Registration] Init Registration Loaded',
	RegistrationComplete = '[Registration Complete] Company Registration Complete',
	RegistrationCompleteLoaded =  '[Registration Complete Loaded] Company Registration Loaded',
	CompanyEditPageRequested = '[Particioant Page Requested] Company Edit Page Requested',
	CompanyEditPageLoaded = '[Particioant Page Loaded] Company Edit Page Loaded',
	CompanyProfilePageRequested = '[Company Profile Requested] Company Profile Page Requested',
	CompanyProfilePageLoaded = '[Company Profile Loaded] Company Profile Page Loaded',
	CompanyUpdatedResponse = '[Company Updated] Particpant Updated Response'
}
 
export class CompanyOnServerCreated implements Action {
	readonly type = CompanyActionTypes.CompanyOnServerCreated;
	constructor(public payload: { company: Company }) { }
}

export class CompanyCreated implements Action {
	readonly type = CompanyActionTypes.CompanyCreated;
	constructor(public payload: { company: any }) { }
}

export class CompanyUpdated implements Action {
	readonly type = CompanyActionTypes.CompanyUpdated;
	constructor(public payload: {
		partialCompany: Update<Company>,
		company: Company
	}) { }
}

export class CompanyUpdatedResponse implements Action {
	readonly type = CompanyActionTypes.CompanyUpdatedResponse;
	constructor(public payload: { company: any }) { }
}

export class CompanyDeleted implements Action {
	readonly type = CompanyActionTypes.CompanyDeleted;
	constructor(public payload: { id: number }) { }
}

export class CompanysPageRequested implements Action {
	readonly type = CompanyActionTypes.CompanysPageRequested;
	constructor(public payload: { page: QueryParamsModel }) {

	 }
}

export class CompanysPageLoaded implements Action {
	readonly type = CompanyActionTypes.CompanysPageLoaded;
	constructor(public payload: { companys: Company[], total: number, success: boolean, page: QueryParamsModel }) { }
}

export class CompanysPageCancelled implements Action {
	readonly type = CompanyActionTypes.CompanysPageCancelled;
}

export class AllCompanysRequested implements Action {
    readonly type = CompanyActionTypes.AllCompanysRequested;
}

export class CompanysPageToggleLoading implements Action {
	readonly type = CompanyActionTypes.CompanysPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class AllCompanysLoaded implements Action {
    readonly type = CompanyActionTypes.AllCompanysLoaded;
    constructor(public payload: { companys: any }) { }
}

export class CompanysActionToggleLoading implements Action {
	readonly type = CompanyActionTypes.CompanysActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class GetCompanyById implements Action {
	readonly type = CompanyActionTypes.GetCompanyById;
	constructor(public payload: {company_id: any}) { }
}

export class CompanyByIdLoaded implements Action {
	readonly type = CompanyActionTypes.CompanyByIdLoaded;
	constructor(public payload: { company: any}) { }
}

export class InitRegistration implements Action {
	readonly type = CompanyActionTypes.InitRegistration;
	constructor(public payload: {company: any}) { }
}

export class InitRegristrationLoaded implements Action {
	readonly type = CompanyActionTypes.InitRegristrationLoaded;
	constructor(public payload: { company: any}) { }
}

export class CompanyEditPageRequested implements Action {
	readonly type = CompanyActionTypes.CompanyEditPageRequested;
	constructor(public payload: { companyId: string }) {

	 }
}

export class CompanyEditPageLoaded implements Action {
	readonly type = CompanyActionTypes.CompanyEditPageLoaded;
	constructor(public payload: { companys: any, success: boolean }) { }
}



//Registraion Company
export class RegistrationComplete implements Action {
	readonly type = CompanyActionTypes.RegistrationComplete;
	constructor(public payload: {registrationData: any}) { }
}

export class RegistrationCompleteLoaded implements Action {
	readonly type = CompanyActionTypes.RegistrationCompleteLoaded;
	constructor(public payload: { registrationCompleteData: any, success: boolean}) { }
}

export class CompanyProfilePageRequested implements Action {
	readonly type = CompanyActionTypes.CompanyProfilePageRequested;
	constructor(public payload: {}) {

	 }
}

export class CompanyProfilePageLoaded implements Action {
	readonly type = CompanyActionTypes.CompanyProfilePageLoaded;
	constructor(public payload: { company: any, total: number, success: boolean}) { }
}




export type CompanyActions = CompanyCreated
	| CompanyUpdated
	| CompanyDeleted
	| CompanyOnServerCreated
	| CompanysPageLoaded
	| CompanysPageCancelled
	| AllCompanysRequested
	| CompanysPageToggleLoading
	| CompanysPageRequested
	| AllCompanysLoaded
	| GetCompanyById
	| CompanyByIdLoaded
	| InitRegistration
	| InitRegristrationLoaded
	| RegistrationComplete
	| RegistrationCompleteLoaded
	| CompanyEditPageLoaded
	| CompanyEditPageRequested
	| CompanysActionToggleLoading
	| CompanyProfilePageRequested
	| CompanyUpdatedResponse
	| CompanyProfilePageLoaded;

