import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
	/**
	 * Check matching NewPassword with confirm NewPassword
	 * @param control AbstractControl
	 */
	static MatchPassword(control: AbstractControl) {
		const NewPassword = control.get('NewPassword').value;

		const ConfirmPassword = control.get('ConfirmPassword').value;

		if (NewPassword !== ConfirmPassword) {
			control.get('ConfirmPassword').setErrors({ConfirmPassword: true});
		} else {
			return null;
		}
	}
}
