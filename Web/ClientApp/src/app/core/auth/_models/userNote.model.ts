import { BaseModel } from '../../_base/crud';

export class UserNote extends BaseModel {
	id: string;
	createDate: string;
	title: string;
	text: string;
	type: string;
	patientId: string;
	files: any;

	clear(): void {
		this.id = '';
		this.title = '';
		this.text = '';
		this.type = '';
		this.createDate = '';
	}
}
