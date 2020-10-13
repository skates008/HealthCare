import { Component, OnInit, ViewChild,} from '@angular/core';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';

import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { AppState } from './../../../core/reducers';
import { 
	selectParticipantById, 
	Participant, 
	ParticipantUpdated, 
	InitRegistration, 
	selectInitRegistration, 
	RegistrationComplete, 
	selectRegistrationComplete,
	Provider,
	ProviderRegistration,
	selectLastCreatedProviderId
} 
	from './../../../core/auth';
import { Update } from '@ngrx/entity';
import { Router } from '@angular/router';
// import { Provider } from 'src/app/core/auth/_models/provider.model';


@Component({
	selector: 'kt-welcome-dialog',
	templateUrl: './welcomeProvider-dialog.component.html',
	styleUrls: ['./welcomeProvider-dialog.component.scss'],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
	],
})
export class WelcomeProviderDialogComponent implements OnInit {
	isLinear = false;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	provider: any;
	currentCarer: any;
	hasFormErrors: boolean = false;
	providerId: any;
	returnUrl = '/';
	@ViewChild('pickre', {static: true}) datePicker: MatDatepicker<Date>;

	constructor(
		private _formBuilder: FormBuilder,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		) {
			// this.providerId = JSON.parse(localStorage.getItem('user_data')).user_id;
		 }

	ngOnInit() {

		this.initForm();

		// this.store.dispatch(new InitRegistration({provider: {} }));
		// this.store.pipe(select(selectInitRegistration)).subscribe(res => {
		// 		if (res) {
		// 		this.provider = res;
				this.createForm();
	// 		}
	// })
	}

	validateABN(value) {

		var weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
			abn = value.replace(/[^\d]/, ''),
			result = false;
	
		// check length is 11 digits
		if (abn.length === 11) {
	
			// apply ato check method
			var sum = 0,
				weight;
	
			for (var index = 0; index <= weights.length - 1; index++) {
				weight = weights[index];
				const digit = abn[index] - (index ? 0 : 1);
				sum += weight * digit;
			}
	
			result = sum % 89 === 0;
		}
	
		return result;
	}

	createForm() {
		this.firstFormGroup = this._formBuilder.group({
			name: [this.provider.name, Validators.required],
			tradingName: [this.provider.lastName, Validators.required],
			// entityName: [this.provider.entityName, Validators.required],
			address: [this.provider.address, Validators.required],
			phoneNumber: [this.provider.phoneNumber, Validators.required],
			abnNumber: [this.provider.abnNumber, [Validators.required, Validators.maxLength(11),Validators.minLength(11) , this.validateABN]],
			isNDISRegistered:[this.provider.isNDISRegistered, Validators.required],
			ndisServicesProvided: [this.provider.ndisServicesProvided],
			email: [this.provider.email, Validators.email],
			primaryContactFirstName: [this.provider.primaryContactFirstName, Validators.required],
			primaryContactLastName: [this.provider.primaryContactLastName, Validators.required],
			PrimaryContactNo: [this.provider.PrimaryContactNo, Validators.required],
			PrimaryContactPosition: [this.provider.PrimaryContactPosition, Validators.required],
			otherServices: [this.provider.otherServices, Validators.required],
			registrationNumber: [this.provider.registrationNumber, Validators.required],
		});
	}

	initForm() {
		this.firstFormGroup = this._formBuilder.group({
			name: [''],
			tradingName: [''],
			// entityName: [''],
			address: [''],
			phoneNumber: [''],
			abnNumber: [''],
			isNDISRegistered:[''],
			ndisServicesProvided: [''],
			email: [''],
			primaryContactFirstName: [''],
			primaryContactLastName: [''],
			PrimaryContactNo: [''],
			PrimaryContactPosition: [''],
			otherServices: [''],
			registrationNumber: [''],
		});
	}



	prepareProvider() {
		const controls = this.firstFormGroup.controls;
		const _provider = new Provider();
		_provider.clear();
		// _provider.id = this.provider.id;
		_provider.name = controls['name'].value;
		_provider.tradingName = controls['tradingName'].value;
		// _provider.entityName = controls['entityName'].value;
		_provider.registeredCompanyAddress = controls['address'].value;
		_provider.phoneNumber = controls['phoneNumber'].value;
		_provider.abnNumber = controls['abnNumber'].value;
		_provider.isNDISRegistered = controls['isNDISRegistered'].value;
		_provider.ndisServicesProvided = controls['ndisServicesProvided'].value;
		_provider.email = controls['email'].value;
		_provider.primaryContactFirstName = controls['primaryContactFirstName'].value;
		_provider.primaryContactLastName = controls['primaryContactLastName'].value;
		_provider.PrimaryContactNo = controls['PrimaryContactNo'].value;
		_provider.PrimaryContactPosition = controls['PrimaryContactPosition'].value;
		_provider.otherServices = controls['otherServices'].value;
		_provider.registrationNumber = controls['registrationNumber'].value;
		return _provider;
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = true;
		const controls = this.firstFormGroup.controls;
		
		if (this.firstFormGroup.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		} 

		const editedProvider = this.prepareProvider();
		this.addWelcomeData(editedProvider);
	}

	addWelcomeData(registrationData){
			this.store.dispatch(new ProviderRegistration({provider: registrationData }));
			 this.store.pipe(select(selectLastCreatedProviderId)).subscribe(newId => {
				if (!newId) {
				  return;
				}
				const message = `Thanks for filling out the welcome page !`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				this.router.navigateByUrl(this.returnUrl + 'provider-dashboard');
			  });
		}

		/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	}