import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';

type Nullable<T> = T | null;

export class Practitioner extends BaseModel {
	id: number;
	firstName: string;
	lastName: string;
	preferredName: string;
	ndisnumber: number;
	gender: string;
	dateOfBirth: Date;
	cob: string;
	ethnicity: string;
	addressline1: string;
	addressline2: string;
	postcode: number;
	city: string;
	state: string;
	country: string;
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
	languageSpoken: string;
	interpreter: string;
	email: string;

	clear(): void {
		this.id = undefined;
		this.firstName = '';
		this.lastName = '';
		this.preferredName = '';
		this.gender = '';
		this.dateOfBirth = null;
		this.cob = '';
		this.ethnicity = '';
		this.addressline1 = '';
		this.addressline2 = '';
		this.postcode = undefined;
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
		this.languageSpoken = '';
		this.interpreter = '';
		this.email = '';
	}
}
