import { Component, ElementRef, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material';

// Services and Models
import {
	Participant,
	ParticipantOnServerCreated,
	selectParticipantsInStore,
	selectIsSuccess,
	AuthService
} from './../../../core/auth';
import { AppState } from './../../../core/reducers';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';

import { MatDatepicker } from '@angular/material';
import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'kt-participant-record-add',
	templateUrl: './participant-record-add.component.html',
	styleUrls: ['./participant-record-add.component.scss'],
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
export class ParticipantRecordAddComponent implements OnInit, OnDestroy {

	@ViewChild('participantExistTemp', { static: true }) participantExistTemp: TemplateRef<any>; // Note: TemplateRef requires a type parameter for the component reference. In this case, we're passing an `any` type as it's not a component.
	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('stages', { static: true }) ele: ElementRef;


	participant: Participant;
	participantId$: Observable<number>;
	oldParticipant: Participant;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	participantForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	resetButton: boolean = false;
	participantList: any;
	participantExist: any;
	newParticipantDetails: Participant;
	participantTempDialog: any;
	currentCarer: any;
	NDISvalid = "[43]{2}[A-Za-z0-9]{1,18}";
	maxDate: Date;
	message;
	addressValid: boolean = true;
	hasSecondaryCarer: boolean = false;
	itemFocus:boolean =  false;
	addressResult: any;
	hideTab: boolean = false;
	hasCarer: boolean = false;
	hasSchool: boolean = false;
	custodians: FormArray;
	secondaryCustodians: FormArray;
	latitude: any;
	longitude: any;
	billingLatitude: any;
	billingLongitude: any;

	options = 
	{
		types: [],
		componentRestrictions: { country: 'AU' }
	};
		

	
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private participantFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog,
		private auth: AuthService,
	) {
		this.maxDate = new Date();
		
	 }


	ngOnInit() {
		this.participant = new Participant();

		this.participantFB.group({
			FirstName: '',
			LastName: '',
			email: '',
			contact: '',
			relation: ''
		  });

		  this.addressResult = {
			streetName: '',
			streetNumber: '',
			unit: 10,
			state: '',
			city: '',
			postCode: '',
			formattedAddress: ''
		}

				this.participant.clear();
				this.oldParticipant = Object.assign({}, this.participant);
				this.initParticipant();
				this.resetButton = false;	
		}


	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initParticipant() {
		this.createForm();
			this.subheaderService.setTitle('New Client Record')
	}


	createForm() {
		this.participantForm = this.participantFB.group({
			firstName: [this.participant.firstName, Validators.required],
			lastName: [this.participant.lastName, Validators.required],
			email: [this.participant.email, Validators.email],
			preferredName: [this.participant.preferredName],
			ndisNumber: [this.participant.ndisNumber, [Validators.required]],
			gender: [this.participant.gender, Validators.required],
			languageSpoken : [this.participant.language, Validators.required],
			dateOfBirth: [this.participant.dateOfBirth, Validators.required],
			// streetNumber : ['', Validators.required],
			// formattedAddress : [''],
			// state : ['', Validators.required],
			// postCode : ['', Validators.required],
			// city : ['', Validators.required],
			// streetName : ['', Validators.required],
			// unit : [''],
			clientAddress: this.participantFB.group({
				address: [],
				streetName: ['', Validators.required],
				streetNumber: ['', Validators.required],
				unit: [],
				city: ['', Validators.required],
				state: ['', Validators.required],
				postalCode: ['', Validators.required],
				country: [],
				latitude: [],
				longitude: [],
				observations: [],
				addressType: ["clientAddress"]
			}),

			primaryCustodians: this.participantFB.group({
				FirstName: [''],
				LastName:[''],
				email:[''],
				relation: [''],
				contact:['']
			}),
			secondaryCustodians: this.participantFB.array([ this.createSecondaryCustodians()]),
			hasSecondaryCarer: [this.participant.hasSecondaryCarer],
			hasSchool: [this.participant.hasSchool],
			schoolName : [this.participant.schoolName],
			// schoolAdress : [this.participant.schoolAddress],
			schoolAddress: this.participantFB.group({
				address: [],
				streetName: [],
				streetNumber: [],
				unit: [],
				city: [],
				state: [],
				postalCode: [],
				country: [],
				latitude: [0],
				longitude: [0],
				observations: [],
				addressType: ["schoolAddress"]
			}),
			schoolTeacherName : [this.participant.schoolTeacherName],
			schoolPrimaryContact : [this.participant.schoolPrimaryContact],
			schoolContactNumber : [this.participant.schoolContactNumber],
			schoolEmail : [this.participant.schoolEmail],
			schoolTeacherEmail : [this.participant.schoolTeacherEmail],
			billingDetails: this.participantFB.group({
				accountNumber: [''],
				email: [''],
				address: this.participantFB.group({
					observations:[],
					unit:[],
					streetNumber:[],
					streetName:[],
					city:[],
					state:[],
					postalCode:[],
					latitude:[0],
					longitude:[0]
				  })
			
			}),
		});
	}


	createCustodians(): FormGroup{
		return this.participantFB.group({
		  });
	}

	createSecondaryCustodians(): FormGroup {
		return this.participantFB.group({
		  FirstName: '',
		  LastName: '',
		  email: '',
		  contact: '',
		  relation: ''
		});
	  }

	  addSecondaryCustodians(): void {
		this.secondaryCustodians = this.participantForm.get('secondaryCustodians') as FormArray;
	  }

	goBackWithId() {
		const url = `/participant-record/participants`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	refreshParticipant(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/participant-record/participants/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.participantForm.controls;
		/** check form */
		if (this.participantForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			if(controls.address.status == "INVALID") {
				this.addressValid = false;
			    this.message = controls.address.errors.address.message
			}

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const preapredParticipant = this.prepareParticipant();
		this.addParticipant(preapredParticipant, true);
	}

	prepareParticipant(): Participant {
		const controls = this.participantForm.controls;
		const _participant = new Participant();
		// _participant.clear();
			if (controls['primaryCustodians'].value["email"] === '' || controls['primaryCustodians'].value["email"] === null) {
				this.hasCarer = false;
			}else{
				this.hasCarer = true;
			}

			if ( (controls['secondaryCustodians'].value[0]['email'] === '' ||  controls['secondaryCustodians'].value[0]['email'] === null) || (controls['secondaryCustodians'].value[0]['email'] !== '' && !this.hasSecondaryCarer) ) {
				this.hasSecondaryCarer = false;
			}else{
				this.hasSecondaryCarer = true;
			}

		
		if(this.hasCarer && !this.hasSecondaryCarer){
			_participant.custodians = {
				primary: controls['primaryCustodians'].value,
			}
		}	else if(this.hasCarer && this.hasSecondaryCarer){
			_participant.custodians = {
				primary: controls['primaryCustodians'].value,
				secondary: controls['secondaryCustodians'].value,
			}
		}
		
		_participant.id = this.participant.id;
		_participant.firstName = controls['firstName'].value;
		_participant.lastName = controls['lastName'].value;
		_participant.email = controls['email'].value;
		_participant.preferredName = controls['preferredName'].value;
		_participant.ndisNumber = controls['ndisNumber'].value;
		_participant.gender = controls['gender'].value;
		_participant.language = controls['languageSpoken'].value;
		_participant.country = "Australia";
		_participant.dateOfBirth = controls['dateOfBirth'].value;
		_participant.hasCarer = this.hasCarer;
		_participant.schoolName = controls['schoolName'].value;
		// _participant.schoolAddress = controls['schoolAdress'].value;
		_participant.schoolTeacherName = controls['schoolTeacherName'].value;
		_participant.schoolPrimaryContact = controls['schoolPrimaryContact'].value;
		_participant.schoolContactNumber = controls['schoolContactNumber'].value;
		_participant.schoolEmail = controls['schoolEmail'].value;
		_participant.schoolTeacherEmail = controls['schoolTeacherEmail'].value;

		// Address
		_participant.address = controls['clientAddress'].value;
		_participant.schoolAddress = controls['schoolAddress'].value;
		// _participant.address = controls['formattedAddress'].value;
		// _participant.unit = controls['unit'].value;
		// _participant.state = controls['state'].value;
		// _participant.city = controls['city'].value;
		// _participant.postCode = controls['postCode'].value;
		// _participant.streetNumber = controls['streetNumber'].value;
		// _participant.streetName = controls['streetName'].value;
		// _participant.latitude = this.latitude;
		// _participant.longitude = this.longitude;

		// BillingDetails
		_participant.billingDetails = controls['billingDetails'].value;
		return _participant;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	carerSelected(value) {
		this.currentCarer = value;
	}

	secondaryCarerSelected(value){
		if(value){
			this.hasSecondaryCarer = value;
			this.addSecondaryCustodians();
		}else{
			this.hasSecondaryCarer = value;	
		}
	}

	schoolSelected(value){
		if(value){
			this.hasSchool= value;
		}else{
			this.hasSchool = value;
		}
	}

	addParticipant(_participant: Participant, withBack: boolean = false) {
		this.store.pipe(select(selectParticipantsInStore)).subscribe(res => {
			this.participantList = res.data;
			this.newParticipantDetails = _participant;
			this.participantExist = this.participantList.filter(participant => {
				return participant.ndisNumber == _participant.ndisNumber
			})
		});
		
			this.store.dispatch(new ParticipantOnServerCreated({ participant: _participant }));
			const addSubscription = this.store.pipe(select(selectIsSuccess)).subscribe(success => {
				if (success) {
				const message = `New client successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
					if (withBack) {
						this.goBackWithId();
					} else {
					}
				}
			});
			this.subscriptions.push(addSubscription);
		// }
	}

	getComponentTitle() {
		let result = 'Create Participant';
	}

	editParticipant(id) {
		this.router.navigate(['../participant-record/edit', id], { relativeTo: this.activatedRoute });
	}

	addInformation(participantDetails) {
		participantDetails.id = this.participantExist[0].id;
		this.participantTempDialog.close();
	}

	back(){
		this.selectedTab = this.selectedTab-1;
		if(this.selectedTab == -1){
			const url = `/participant-record/participants`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
		}
	}

	nextStep() {
		if (this.selectedTab <= 3) {
		  this.selectedTab = this.selectedTab + 1;
		  this.hideTab = false;
		  if(this.selectedTab == 4){
			this.hideTab = true;
		  }
		} else {
			this.hideTab = true;
		}
	  }

	  handleAddressChange(address) {
			let clientAddressControls = this.participantForm['controls'].clientAddress['controls'];
			clientAddressControls.streetNumber.reset();
			clientAddressControls.streetName.reset();
			clientAddressControls.city.reset();
			clientAddressControls.state.reset();
			clientAddressControls.postalCode.reset();
			clientAddressControls.latitude.reset();
			clientAddressControls.longitude.reset();

			clientAddressControls.address.setValue(address.formatted_address);
		   address.address_components.forEach(res=>{
				res.types.includes("street_number") ? clientAddressControls.streetNumber.setValue(res.long_name): "";
				res.types.includes("route") ? clientAddressControls.streetName.setValue(res.long_name): "";
				res.types.includes("administrative_area_level_2") ? clientAddressControls.city.setValue(res.long_name): "";
				res.types.includes("administrative_area_level_1") ? clientAddressControls.state.setValue(res.long_name): "";
				res.types.includes("postal_code") ? clientAddressControls.postalCode.setValue(res.long_name):"";
				clientAddressControls.latitude.setValue( address.geometry.location.lat());
				clientAddressControls.longitude.setValue(address.geometry.location.lng());
		   }) 
		}

		handleSchoolAddressChange(address) {
			let schoolAddressControls = this.participantForm['controls'].schoolAddress['controls'];
			schoolAddressControls.streetNumber.reset();
			schoolAddressControls.streetName.reset();
			schoolAddressControls.city.reset();
			schoolAddressControls.state.reset();
			schoolAddressControls.postalCode.reset();
			schoolAddressControls.latitude.reset();
			schoolAddressControls.longitude.reset();

			schoolAddressControls.address.setValue(address.formatted_address);
		   address.address_components.forEach(res=>{
				res.types.includes("street_number") ? schoolAddressControls.streetNumber.setValue(res.long_name): "";
				res.types.includes("route") ? schoolAddressControls.streetName.setValue(res.long_name): "";
				res.types.includes("administrative_area_level_2") ? schoolAddressControls.city.setValue(res.long_name): "";
				res.types.includes("administrative_area_level_1") ? schoolAddressControls.state.setValue(res.long_name): "";
				res.types.includes("postal_code") ? schoolAddressControls.postalCode.setValue(res.long_name):"";
				schoolAddressControls.latitude.setValue( address.geometry.location.lat());
				schoolAddressControls.longitude.setValue(address.geometry.location.lng());
		   }) 
		}



		handleBillingAddressChange(address) {
					let billingControls = this.participantForm['controls'].billingDetails['controls'];
					billingControls.address.controls.observations.setValue(address.formatted_address);
					address.address_components.forEach(res=>{
						res.types.includes("street_number")?billingControls.address.controls.streetNumber.setValue(res.long_name): "";
						res.types.includes("route")?billingControls.address.controls.streetName.setValue(res.long_name): "";
						res.types.includes("administrative_area_level_2")?billingControls.address.controls.city.setValue(res.long_name): "";
						res.types.includes("administrative_area_level_1")?billingControls.address.controls.state.setValue(res.long_name): "";
						res.types.includes("postal_code")?billingControls.address.controls.postalCode.setValue(res.long_name):"";
						billingControls.address.controls.latitude.setValue(address.geometry.location.lat());
						billingControls.address.controls.longitude.setValue(address.geometry.location.lng());
				   })
		}
}
