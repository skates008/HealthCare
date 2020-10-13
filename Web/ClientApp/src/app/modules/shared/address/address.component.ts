import { Component, OnInit, Input, OnChanges, forwardRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, NgControlStatus, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
// import { Participant } from 'src/app/core/auth';


@Component({
	selector: 'kt-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AddressComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => AddressComponent),
			multi: true
		}
	]
})
export class AddressComponent implements ControlValueAccessor, OnDestroy {

	subscriptions: Subscription[] = [];
	addressForm: FormGroup;
	options =
		{
			types: [],
			componentRestrictions: { country: 'AU' }
		};


	get value(): any {
		return this.addressForm.value;
	}

	set value(value: any) {
		this.addressForm.setValue(value);
		this.onChange(value);
		this.onTouched();
	}


	constructor(
		private addressFB: FormBuilder,
	) {
		this.addressForm = this.addressFB.group({
			streetNumber: [''],
			address: [''],
			state: [''],
			postCode: [''],
			city: [''],
			streetName: [''],
			unit: ['']
		});

		this.subscriptions.push(
			this.addressForm.valueChanges.subscribe(value => {
				this.onChange(value);
				this.onTouched();
			})
		);
	}
	//    registerOnChange(fn) {
	//     this.onChange = fn;
	//   }

	//   writeValue(value) {
	//     if (value) {
	//       this.value = value;
	//     }

	//     if (value === null) {
	//       this.addressForm.reset();
	//     }
	//   }

	//   registerOnTouched(fn) {
	//     this.onTouched = fn;
	//   }


	ngOnDestroy() {
		this.subscriptions.forEach(s => s.unsubscribe());
	}

	// createForm() {

	// }	

	handleAddressChange(address) {
		this.addressForm.get('streetNumber').reset();
		this.addressForm.get('streetName').reset();
		this.addressForm.get('city').reset();
		this.addressForm.get('state').reset();
		this.addressForm.get('postCode').reset();
		this.addressForm.controls.address.setValue(address.formatted_address);
		address.address_components.forEach(res => {
			res.types.includes("street_number") ? this.addressForm.controls.streetNumber.setValue(res.long_name) : "";
			res.types.includes("route") ? this.addressForm.controls.streetName.setValue(res.long_name) : "";
			res.types.includes("administrative_area_level_2") ? this.addressForm.controls.city.setValue(res.long_name) : "";
			res.types.includes("administrative_area_level_1") ? this.addressForm.controls.state.setValue(res.long_name) : "";
			res.types.includes("postal_code") ? this.addressForm.controls.postCode.setValue(res.long_name) : "";
		})
	}

	onChange: any = () => { };
	onTouched: any = () => { };



	writeValue(val: any): void {
		val && this.addressForm.setValue(val, { emitEvent: false });
	}
	registerOnChange(fn: any): void {
		this.addressForm.valueChanges.subscribe(fn);
	}
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
	setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.addressForm.disable() : this.addressForm.enable();
	}

	validate(c: AbstractControl): ValidationErrors | null {
		return this.addressForm.valid ? null : { invalidForm: { valid: false, message: "Address fields are invalid" } };
	}

}

