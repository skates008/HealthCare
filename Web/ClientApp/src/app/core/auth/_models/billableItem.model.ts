import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { AuthNotice } from '../auth-notice/auth-notice.interface';

type Nullable<T> = T | null;

export class BillableItem extends BaseModel {
	// billableItem Model data for now
	id: number;
	issueDate: Date;
	from?: string;
	business: number;
	category: number;
	reason: string;
	status: number; // 0 = Active | 1 = Suspended | Pending = 2

	isBillable: boolean;
	name: string;
	price: number;
	unitType: number;
	NDISSupportItemNumber: string;
	gstCode: number;
	description: string;

	// billableItemTo: string;
	participant?: number;
	// extraInfo?: string;
	// appointments?: {
	// 	value: string;
	// };
	practitioner?: string;
	totalDiscount?: string;
	billableItemTax?: number;
	billableItemSubTotal?: number;
	note?: string;
	outStanding?: number;
	Name: string;
	Price: any;
	unit: any;
	Description: string;
	ndisNumber : number;

	billableItemItem?: BillableItemItem[];
	clear(): void {
	// 	this.id = undefined;
	// 	this.issueDate= null;
	// 	this.from= '';
	// 	this.business= undefined;
	// 	this.category = undefined;
	// 	this.reason = '';
	// 	this.status = undefined;

	// 	this.name = '';
	// 	this.price= undefined;
	// 	this.unitType= undefined;
	// 	this.NDISSupportItemNumber= '';
	// 	this.GSTCode= undefined;
	// 	this.description= '';
		
	// //	this.billableItemTo= '';
	// 	this.participant= undefined;
	// //	this.extraInfo= '';
	// 	//this.appointments= undefined;
	// 	this.practitioner= '';
	// 	this.totalDiscount='';
	// 	this.billableItemTax= undefined;
	// 	this.billableItemSubTotal= undefined;
	// 	this.note= '';
	// 	this.outStanding= undefined;
	// 	this.billableItemItem= undefined;

	}
}

export class BillableItemItem {
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
