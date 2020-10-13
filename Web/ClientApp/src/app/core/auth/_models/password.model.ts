import { BaseModel } from '../../_base/crud';

type Nullable<T> = T | null;

export class Password extends BaseModel {
	// password
	currentPassword: string;
	NewPassword: string;
	ConfirmPassword: string;

	clear(): void {
		// password
		this.currentPassword = '';
		this.NewPassword = '';
		this.ConfirmPassword = ''
	}
}

