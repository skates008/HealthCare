import { BaseModel } from '../../_base/crud';

type Nullable<T> = T | null;

export class ProviderBasic extends BaseModel {
	// profile Model data for now
	id: number;
	name: string;
	companyType: string;
	tradingName: string;
	entityName: string;
	abnNumber: string;
	action: string;

	registeredCompanyAddress: any;

	clear(): void {
		this.id = undefined;
		this.name = '';
		this.companyType = '';
		this.tradingName = '';
		this.entityName = '';
		this.abnNumber = '';
		this.registeredCompanyAddress = '';
	}
}