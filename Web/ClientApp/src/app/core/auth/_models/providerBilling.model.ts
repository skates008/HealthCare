import { BaseModel } from '../../_base/crud';

type Nullable<T> = T | null;

export class ProviderBilling extends BaseModel {
	// profile Model data for now
	billingCycle: string;
	billingDayOfMonth: number;
	billingDayOfWeek: string;
	billingTimeOfDay: string;
	billingWeekCycle: number;
	invoicePaymentText: string;
	invoiceReferenceFormat: string;
	paymentDueInDays: number;
	action: string;

	clear(): void {
		this.billingCycle = '';
		this.billingDayOfMonth = undefined;
		this.billingDayOfWeek = '';
		this.billingTimeOfDay = '';
		this.billingWeekCycle = undefined;
		this.invoicePaymentText = '';
		this.invoiceReferenceFormat = '';
		this.paymentDueInDays = undefined;
	}
}
