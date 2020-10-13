import { BaseModel } from '../../_base/crud';

export class Files extends BaseModel {
	id: string;
	createDate: string;
	title: string;
	createdByName: string;
	createdById: Date;
	mimeType: string;
	patientId: string;
	filename: string;

	clear(): void {
		this.id = '';
		this.title = '';
		this.createdByName = '';
		this.createdById = undefined;
		this.mimeType = '';
		this.createDate = '';
		this.filename = '';
	}
}
