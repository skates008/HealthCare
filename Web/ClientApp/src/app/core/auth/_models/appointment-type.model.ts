import { BaseModel } from '../../_base/crud';

export class AppointmentType extends BaseModel {
	id: string;
	name: string;
	isBillable: string;

	clear(): void {
		this.id = '';
		this.name = '';
		this.isBillable = '';
	}
}
