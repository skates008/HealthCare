import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';

type Nullable<T> = T | null;

export class Company extends BaseModel {
	id: number;
	firstName: string;
	lastName: string;
	preferredName: string;
	ndisNumber: string;
	gender: number;
	dateOfBirth: Date;
	country: string;
	ethnicity: number;
	addressline1: string;
	addressline2: string;
	postCode: number;
	hasCarer: Nullable<boolean>;
	carer: number;
	carerFirstName: string;
	carerLastName: string;
	carerEmail: string;
	carerContact: string;
	carerRelation: string;
	city: string;
	state: string;
	childcare: string;
	childcareNa: Nullable<boolean>;
	school: string;
	schoolYear: number;
	schoolHome: Nullable<boolean>;
	schoolNa: Nullable<boolean>;
	uni: string;
	phone: string;
	uniNa: Nullable<boolean>;
	occupation: string;
	employer: string;
	occupationNa: Nullable<boolean>;
	language: string;
	interpreter: string;
	email: string;
	success: boolean;
	streetNumber: string;
	hasSecondaryCarer:boolean;
	secondaryCarerFullName: string;
	secondaryCarerRelation: string;
	secondaryCarerPhoneNumber: string;
	secondaryCarerHomeNumber: string;
	secondaryCarerContact: string;
	address: string;
	streetName: string;
	schoolName: string;
	schoolAddress:string;
	schoolTeacherName: string;
	schoolPrimaryContact: string;
	schoolEmail:string;
	schoolContactNumber: string;
	schoolTeacherEmail:string;
	hasSchool: boolean;
	custodians: any;
	secondaryCarerFirstName: string;
	secondaryCarerLastName: string;
	secondaryCarerEmail:string;
	unit:string;

	clear(): void {
		this.id = undefined;
		this.firstName = '';
		this.lastName = '';
		this.preferredName = '';
		this.gender = undefined;
		this.dateOfBirth = null;
		this.ethnicity = undefined;
		this.ndisNumber = '';
		// this.addressline1 = '';
		// this.addressline2 = '';
		this.postCode = undefined;
		this.hasCarer = undefined;
		this.carer = undefined;
		// this.carerFirstName = '';
		// this.carerLastName = '';
		// this.carerEmail = '';
		// this.carerContact = '';
		// this.carerRelation = '';
		this.city = '';
		this.state = '';
		this.country = '';
		this.childcare = '';
		this.childcareNa = undefined;
		this.school = '';
		this.schoolYear = undefined;
		this.schoolHome = undefined;
		this.schoolNa = undefined;
		this.uni = '';
		this.phone = '';
		this.uniNa = undefined;
		this.occupation = '';
		this.employer = '';
		this.occupationNa = undefined;
		this.language = '';
		this.interpreter = '';
		this.email = '';
		// this.secondaryCarerFirstName = '' ,
		// this.secondaryCarerLastName= '',
		// this.secondaryCarerEmail = '',
		// this.secondaryCarerContact= '' ,
		// this.secondaryCarerRelation= '',
		// this.hasSecondaryCarer=undefined;
	// this.secondaryCarerFullName= '';
	// this.secondaryCarerRelation= '';
	// this.secondaryCarerPhoneNumber= '';
	// this.secondaryCarerHomeNumber ='';
	// this.secondaryCarerContact= '';
	this.address = '';
	this.streetName = '';
	this.schoolName= '';
	this.schoolAddress= '';
	this.schoolTeacherName='';
	this.schoolPrimaryContact= '';
	this.schoolEmail= '';
	this.schoolContactNumber= '';
	this.schoolTeacherEmail='';
	this.hasSchool = undefined;
	}
}
