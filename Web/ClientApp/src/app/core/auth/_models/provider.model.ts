import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';

type Nullable<T> = T | null;

export class Provider extends BaseModel {
	id: number;
	name: string;
	companyType: string;
	tradingName: string;
	entityName: string;
	services: string;
	profileImage: string;

	registeredCompanyAddress: any;
	city:string;
	state:string;
	postCode:string;
	unit: string;
	streetNumber:string;
	streetName: string;

	businessAddress: any;
	businessEmail: string;
	
	businessWebsite: string;
	phoneNumber: string;
	abnNumber: string;
	ndisServicesProvided: string;
	email: string;
	ndisRegistrationNumber: string;
	medicareRegistrationNumber: string;
	primaryContactName: string;
	otherServices: string;
	registrationNumber: string;
	isNDISRegistered: boolean
	PrimaryContactPosition: string;
	PrimaryContactNo: string;
	primaryContactFirstName: string;
	primaryContactLastName: string;

	clear(): void {
		this.id = undefined;
		this.name = '';
		this.companyType = '';
		this.tradingName = '';
		this.entityName = '';
		this.businessWebsite = '';
		this.services = '';
		
		this.registeredCompanyAddress = '';
		this.city = '';
		this.state = '';
		this.postCode = '';
		this.unit = '';
		this.streetNumber = '';
		this.streetName = '';

		this.businessAddress = '';

		this.phoneNumber = '';
		this.abnNumber = '';
		this.ndisRegistrationNumber = '';
		this.medicareRegistrationNumber = '';
		this.ndisServicesProvided = null;
		this.email = '';
		this.primaryContactName = '';
		this.otherServices = undefined;
		this.PrimaryContactPosition = '';
		this.PrimaryContactNo = '';
	}
}
