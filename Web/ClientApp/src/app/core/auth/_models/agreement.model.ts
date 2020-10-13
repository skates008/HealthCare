import { BaseModel } from '../../_base/crud';

export class Agreement extends BaseModel {
	id: string;
	createDate: string;
	title: string;
	notes: string;
	signedDate: Date;
	validFromDate: Date;
	validToDate: Date;
	assessor: string;
	patientId: string;
	files: any;

	clear(): void {
		this.id = '';
		this.title = '';
		this.notes = '';
		this.signedDate = undefined;
		this.validFromDate = undefined;
		this.validToDate = undefined;
		this.assessor = '';
		this.createDate = '';
	}
}
