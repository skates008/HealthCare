import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';

type Nullable<T> = T | null;

export class Time extends BaseModel {
	// time Model data for now
	id: number;
	name: string;
	// issueDate: string;
	from?: string;
	startTime: string;
	spentTimeInMinutes: number;
	patientName: string;
	carePlanName: string;
	participantId: string;
	business: number;
	endTime: string;
	careplan: number;
	reason: string;
	status: number; // 0 = Active | 1 = Suspended | Pending = 2
	fullDay: boolean; // 0 = Yes | 1 = No 
	subject: string;
	attendees?: number;
	participant?: number;
	practitioner?: string;
	totalDiscount?: string;
	travelTimeInMinutes?: number;
	timeSubTotal?: number;
	note?: number;
	outStanding?: number;
	billableItems?: any;
	careplanId: string;
	appointmentId: string;
	clear(): void {
		this.id = undefined;
		// this.issueDate= null;
		this.name = '';
		this.from = '';
		this.startTime = null;
		this.endTime = null;
		this.careplan = undefined;
		this.reason = '';
		this.participantId = '';
		this.subject = '';
		this.fullDay = undefined;
		this.status = undefined;
		this.careplanId = '';
	//	this.timeTo= '';
		this.attendees= undefined;
		this.participant = undefined;
	//	this.extraInfo= '';
		//this.appointments= undefined;
		this.practitioner= '';
		this.totalDiscount='';
		this.travelTimeInMinutes= undefined;
		this.spentTimeInMinutes = undefined;
		this.timeSubTotal= undefined;
		this.note= undefined;
		this.outStanding= undefined;
		this.billableItems= undefined;

	}
}

export class TimeItem {
	startTime: string;
	id: string;
	quantity: number;
}
