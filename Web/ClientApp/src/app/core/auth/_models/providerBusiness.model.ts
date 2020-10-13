import { BaseModel } from '../../_base/crud';

type Nullable<T> = T | null;

export class ProviderBusiness extends BaseModel {
	// profile Model data for now
	id: number;
	businessEmail: string;
	businessWebSite: string;
	phoneNumber: string;
	businessAddress: any;
	action: string;
	

	clear(): void {
		this.id = undefined;
		this.businessEmail = '';
		this.businessWebSite = '';
		this.phoneNumber = '';
		
		this.businessAddress = '';
	}
}