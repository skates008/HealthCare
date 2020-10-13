import { BaseModel } from '../../_base/crud';
import { Time } from '@angular/common';
import { timeInterval } from 'rxjs/operators';
import { TimeInterval } from 'rxjs';

export class Appointment extends BaseModel {
	id: string;
	practitioner: any;
	type: String;
	participant: any;
	date: any;
	starttime: any;
	endtime: any;
	note: String;
	starttimeObj: any;
	endtimeObj: any;
	status: string;
	cancelDetails: Object;
	cancelReason: string;
	cancelNotes: string;
	rescheduleReason: string;
	assessment: string;
	observation: string;
	appointmentStatus: string;
	appointmentType: number;
	practitionerId: String;
	patientId: any;
	appointmentDate: String;
	location: string;
	addressType: string;
	startTime: any;
	endTime: any;
	teamId: string;
	internalNote: string;
	externalNote: string;
	careplanId: string;
	timeEntry: any;
	billableItems: any;
	action:string;
	AppointmentTypeId: any;
	address:any;
	addressOption: any;
	recurrence : any;
	clear() {
	}
}
