import { BaseModel } from '../../_base/crud';

type Nullable<T> = T | null;

export class Team extends BaseModel {
	id: string;
	name: string;
	users?: TeamUser[];

	clear(): void {
		this.id = undefined;
		this.name = '';
	}
}

export class TeamUser {
	id: string;
	name: string;
}
