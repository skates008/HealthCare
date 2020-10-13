import { BaseModel } from '../../_base/crud';

type Nullable<T> = T | null;

export class ProviderService extends BaseModel {
	// profile Model data for now
	id: number;
	services: string;
	registrationNumber: string;
	medicareRegistrationNumber: string;
	action: string;

	clear(): void {
		this.id = undefined;
		this.services = '';
		this.registrationNumber = '';
		this.medicareRegistrationNumber = '';
	}
}