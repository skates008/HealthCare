import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';

type Nullable<T> = T | null;

export class Careplan extends BaseModel {
	// careplan Model data for now
	id: number;
	// Created date will be here
	created?: Date;
	// status will be: draft | active | on hold | revoked | completd | unknown
	status?: number;
	// intent will be: proposal | plan | order | options
	intent?: string;
	// category: type of plan
	category?: number;
	title?: string;
	serviceBookingReference?: string;
	billingType?: any;
	description?: string;
	// In our case subject is a participant
	participant?: string;
	patientId?: string;
	// Time period plan covers
	peroid?: Date;
	practitioner?: string;
	// Health issues this plan addresses
	address?: string;
	goal?: string;
	patientName?: string;
	frequency?: string;
	budget?: number;
	deductBudget?: any;
	deductBudgetArr?: any;
	note?: string;

	NDISNumber?: string;
	NDISContact?: string;
	start?: Date;
	due?: Date;
	practice?: string;

	startDate: any;
	dueDate: Date;
	// practitionerName: any;
	keyPractitionerId: string;
	practitionerName:any;
	// activity?: ActivityItem[];
	familyGoals?: MyGoalItem[];
	fundedSupport?: MyBudgetItem[];
	practitioners?: MyPractitioners[];

	clear(): void {
		this.id = undefined;
		this.status = undefined;
		this.intent = '';
		this.category = undefined;
		this.title = '';
		this.description = '';
		this.participant = '';
		this.practitioner = '';
		this.patientName = '';
		this.peroid = undefined;
		this.patientId = undefined;
		this.created = undefined;
		this.address = '';
		this.budget = undefined;
		this.note = '';
		this.NDISNumber = '';
		this.NDISContact = '';
		this.start = undefined;
		this.due = undefined;
		this.practice = '';
		this.keyPractitionerId = '';
		// this.activity = undefined;
		this.familyGoals = undefined;
		this.fundedSupport = undefined;
	}
}

// export class ActivityItem {
// 	// Outcome of the activity
// 	outcomeCodableConcept?: string;
// 	// comments about the activity status/progress
// 	progress?: string;
// 	goalActivity?: string;
// 	description?: string;
// 	budgetActivity?: string;
// }

export class MyGoalItem {
	title?: string;
	support?: string;
	strategy?: string;
}

export class MyBudgetItem {
	fundAllocated?: number;
	goal?: string;
	budgetPlanId?: number;
	fundCategoryId?: number;
}

export class MyPractitioners {
	id?: string;
	practitionerName?: string;
}

