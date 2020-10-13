import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';

type Nullable<T> = T | null;

export class TherapyService extends BaseModel {
	// therapyService Model data for now
	id: number;

	title: string;
	providerName: string;
	providerAddress: string;
	providerEmail: string;
	providerNDIS: string;
	
	participantName: string;
	participantAddress: string;
	participantEmail: string;
	participantNDIS: string;

	issueDate: Date;
	startDate: Date;
	endDate: Date;
	careplanId: number;

	planInchargeName: string;
	planInchargeEmail: string;
	planInchargePhone: string;

	furtherTherapy: string;
	familyGoal: string;
	shortTermGoals: GoalItem[];
	

	from?: string;
	business: number;
	category: number;
	reason: string;
	status: string; // 0 = Draft | 1 = Complete | Pending = 2

	name: string;
	price: number;
	unitType: number;
	NDISSupportItemNumber: string;
	GSTCode: number;
	description: string;
	
	practitioner?: string;
	totalDiscount?: string;
	therapyServiceTax?: number;
	therapyServiceSubTotal?: number;
	note?: string;
	outStanding?: number;
	therapyServiceItem?: TherapyServiceItem[];
	clear(): void {
		this.id = undefined;
		this.issueDate= null;
		this.from= '';
		this.business= undefined;
		this.category = undefined;
		this.reason = '';
		this.status = undefined;

		this.name = '';
		this.price= undefined;
		this.unitType= undefined;
		this.NDISSupportItemNumber= '';
		this.GSTCode= undefined;
		this.description= '';
		
		this.providerName = '';
		this.providerAddress = '';
		this.providerEmail = '';
		this.providerNDIS = '';

		this.participantName = '';
		this.participantAddress = '';
		this.participantEmail = '';
		this.participantNDIS = '';
	
	//	this.extraInfo= '';
		//this.appointments= undefined;
		this.practitioner= '';
		this.totalDiscount='';
		this.therapyServiceTax= undefined;
		this.therapyServiceSubTotal= undefined;
		this.note= '';
		this.outStanding= undefined;
		this.therapyServiceItem= undefined;
	}
}

export class TherapyServiceItem {
		item? : string;
		quantity?: number;
		unitPrice?: number;
		type?: string;
		discount?: number;
		code?: string;
		taxRate?: number;
		itemTotal?: number;
		costPrice?: number;
		serialNo?: string;
		supplier?: string;
}

export class GoalItem {
	goalDescription? : string;
	goalOutCome?: string;  // Achieved | Partially Achieved | Not Achieved | Other: Specify
	goalOutComeDetail?: string;
	goalStrategy?: string;
}