import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';

type Nullable<T> = T | null;

export class Therapist extends BaseModel {
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
	postcode: number;
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
	languageSpoken: string;
	interpreter: string;
	email: string;
	success: boolean

	clear(): void {
		this.id = undefined;
		this.firstName = '';
		this.lastName = '';
		this.preferredName = '';
		this.gender = undefined;
		this.dateOfBirth = null;
		this.ethnicity = undefined;
		this.ndisNumber = '';
		this.addressline1 = '';
		this.addressline2 = '';
		this.postcode = undefined;
		this.hasCarer = undefined;
		this.carer = undefined;
		this.carerFirstName = '';
		this.carerLastName = '';
		this.carerEmail = '';
		this.carerContact = '';
		this.carerRelation = '';
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
