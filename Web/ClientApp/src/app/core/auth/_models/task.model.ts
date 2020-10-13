import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';

type Nullable<T> = T | null;

export class Task extends BaseModel {
	// task Model data for now
	id: number;
	issueDate: Date;
	status: number;
	dueDate: Date;
	title: string;
	description?: string;
	clear(): void {
		this.id = undefined;
		this.issueDate= null;
		this.dueDate= null;
		this.description= '';
		this.status= undefined;
		this.title = '';
	}
}
