import { BaseModel } from '../../_base/crud';

export class Assessment extends BaseModel {
	id: string;
	createDate: string;
	title: string;
	notes: string;
	assessmentDate: Date;
	validFromDate: Date;
	validToDate: Date;
	assessor: string;
	patientId: string;
	files: any;

	clear(): void {
		this.id = '';
		this.title = '';
		this.notes = '';
		this.assessmentDate = undefined;
		this.validFromDate = undefined;
		this.validToDate = undefined;
		this.assessor = '';
		this.createDate = '';
	}
}
