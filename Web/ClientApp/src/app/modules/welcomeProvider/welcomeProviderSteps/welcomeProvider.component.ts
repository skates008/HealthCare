import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
	selectLastCreatedProviderId,
	Address,
	selectIsProviderCreateSuccess
} 
	from './../../../core/auth';
import { Update } from '@ngrx/entity';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
	selector: 'kt-welcomeProvider',
	templateUrl: './welcomeProvider.component.html',
	styleUrls: ['./welcomeProvider.component.scss'],
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
export class WelcomeProviderStepsComponent implements OnInit, AfterViewInit {

	@ViewChild('wizard', {static: true}) el: ElementRef;
	@ViewChild('pickre', {static: true}) datePicker: MatDatepicker<Date>;
	addressSubject = new BehaviorSubject<Address>(new Address());
	
	isLinear = false;
	private subscriptions: Subscription[] = [];
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	provider: any;
	message;
	currentCarer: any;
	hasFormErrors: boolean = false;
	providerId: any;
	returnUrl = '/';
	addressValid: boolean = true;
	businessResult: {
		streetName, streetNumber, state, unit, city, postCode, address
   }
	addressResult: {
		streetName, streetNumber, state, unit, city, postCode, address
   }

	submitted = false;

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
	
	
		createForm() {
			this.firstFormGroup = this._formBuilder.group({
				// company details
				name: [this.provider.name, Validators.required],
				tradingName: [this.provider.lastName],
				companyType: [this.provider.companyType, Validators.required],
				abnNumber: [this.provider.abnNumber, [Validators.required]],
				registeredCompanyAddress: [],

				// Business Details
				phoneNumber: [this.provider.phoneNumber, Validators.required],
				businessEmail: [this.provider.businessEmail, [Validators.required, Validators.email]],
				businessWebsite: [this.provider.businessWebsite],
				businessAddress: [],

				// Primary contact
				primaryContactFirstName: [this.provider.primaryContactFirstName, Validators.required],
				primaryContactLastName: [this.provider.primaryContactLastName, Validators.required],
				PrimaryContactNo: [this.provider.PrimaryContactNo],
				PrimaryContactPosition: [this.provider.PrimaryContactPosition],
			
				// Services
				ndisRegistrationNumber: [this.provider.ndisRegistrationNumber],
				medicareRegistrationNumber: [this.provider.medicareRegistrationNumber],
				otherServices: [this.provider.otherServices],

				// extra fields
				registrationNumber: [this.provider.registrationNumber],
				ndisServicesProvided: [this.provider.ndisServicesProvided],
				isNDISRegistered:[1],
			});
		}
	
		initForm() {
			this.firstFormGroup = this._formBuilder.group({
				// company details
				name: [''],
				tradingName: [''],
				companyType: [''],
				abnNumber: [''],
				registeredCompanyAddress: [],

				// Business Details
				phoneNumber: [''],
				businessEmail: [''],
				businessWebsite: [''],
				businessAddress: [],

				// Primary contact
				primaryContactFirstName: [''],
				primaryContactLastName: [''],
				PrimaryContactNo: [''],
				PrimaryContactPosition: [''],

				// Services
				otherServices: [''],
				ndisRegistrationNumber: [''],
				medicareRegistrationNumber: [''],

				// extra fields
				isNDISRegistered:[1],
				ndisServicesProvided: [''],
				registrationNumber: [''],
			});
		}
	
	
	
		prepareProvider() {
			const controls = this.firstFormGroup.controls;
			const _provider = new Provider();
			// company details
			_provider.name = controls['name'].value;
			_provider.tradingName = controls['tradingName'].value;
			_provider.companyType = controls['companyType'].value;
			_provider.abnNumber = controls['abnNumber'].value;
			// Address
			this.addressResult = controls['registeredCompanyAddress'].value;

			_provider.registeredCompanyAddress = {
				address:  this.addressResult.address,
				unit: this.addressResult.unit,
				state: this.addressResult.state,
				city: this.addressResult.city,
				postCode: this.addressResult.postCode,
				streetNumber: this.addressResult.streetNumber,
				streetName: this.addressResult.streetName
			}
			

			// business details
			_provider.phoneNumber = controls['phoneNumber'].value;
			_provider.businessEmail = controls['businessEmail'].value;
			_provider.businessWebsite = controls['businessWebsite'].value;
			this.businessResult = controls['businessAddress'].value;

			_provider.businessAddress = {
				address:  this.businessResult.address,
				unit: this.businessResult.unit,
				state: this.businessResult.state,
				city: this.businessResult.city,
				postCode: this.businessResult.postCode,
				streetNumber: this.businessResult.streetNumber,
				streetName: this.businessResult.streetName
			}

			// provider details
			_provider.otherServices = controls['otherServices'].value;
			_provider.ndisRegistrationNumber = controls['ndisRegistrationNumber'].value;
			_provider.medicareRegistrationNumber = controls['medicareRegistrationNumber'].value;

			// extra fields
			_provider.isNDISRegistered = controls['isNDISRegistered'].value;
			_provider.ndisServicesProvided = controls['ndisServicesProvided'].value;
			_provider.primaryContactFirstName = controls['primaryContactFirstName'].value;
			_provider.primaryContactLastName = controls['primaryContactLastName'].value;
			_provider.PrimaryContactNo = controls['PrimaryContactNo'].value;
			_provider.PrimaryContactPosition = controls['PrimaryContactPosition'].value;

			return _provider;
		}
	
		onSubmit(withBack: boolean = false) {
			this.hasFormErrors = true;
			const controls = this.firstFormGroup.controls;
			
			if (this.firstFormGroup.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);

				if(controls.address.status == "INVALID") {
					this.addressValid = false;
					this.message = controls.address.errors.address.message
				}

				this.hasFormErrors = true;
				return;
			} 

			this.hasFormErrors = false;
			const editedProvider = this.prepareProvider();
			this.addWelcomeData(editedProvider);
		}
	
		addWelcomeData(registrationData){
				this.store.dispatch(new ProviderRegistration({provider: registrationData }));
				const addSubscription = this.store.pipe(select(selectIsProviderCreateSuccess)).subscribe(success => {
					if (success) {
						localStorage.setItem("isRegistractionComplete", JSON.stringify({ isRegistractionComplete: true }));
						const message = `Thanks for filling out the welcome page !`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
						this.router.navigateByUrl(this.returnUrl + 'provider-dashboard');
					}
				  });
				  this.subscriptions.push(addSubscription);
			}
	
			/**
		 * Close Alert
		 *
		 * @param $event: Event
		 */
		onAlertClose($event) {
			this.hasFormErrors = false;
		}

	ngAfterViewInit(): void {
		// Initialize form wizard
		const wizard = new KTWizard(this.el.nativeElement, {
			startStep: 1
		});

		// Validation before going to next page
		wizard.on('beforeNext', (wizardObj) => {
			// https://angular.io/guide/forms
			// https://angular.io/guide/form-validation

			// validate the form and use below function to stop the wizard's step
			// wizardObj.stop();
		});

		// Change event
		wizard.on('change', (wizard) => {
			setTimeout(() => {
				KTUtil.scrollTop();
			}, 500);
		});
	}

}
