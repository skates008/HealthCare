import { BaseModel } from '../../_base/crud';

type Nullable<T> = T | null;

export class Profile extends BaseModel {
	// profile Model data for now
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	position: string;	
	profileImage: string;

	clear(): void {
		this.id = undefined;
		this.firstName = '';
		this.lastName = '';
		this.email = '';
		this.phoneNumber = '';
		this.position = '';
		this.profileImage = '';
	}
}