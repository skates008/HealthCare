import { BaseModel } from '../../_base/crud';

type Nullable<T> = T | null;

export class ProviderAccount extends BaseModel {
	// profile Model data for now
	id: string;
	bankName: string;
	accountNumber: string;
	bicswiftCode: string;
	branchName: string;
	action: string;

	clear(): void {
		this.bankName = '';
		this.accountNumber = '';
		this.bicswiftCode = '';
		this.branchName = ''
	}
}
