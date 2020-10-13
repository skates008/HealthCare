import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, NgModule, OnDestroy, TemplateRef, Directive } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';


// Services and Models
import {
	Participant,
	ParticipantUpdated,
	selectHasParticipantsInStore,
	selectParticipantById,
	ParticipantOnServerCreated,
	selectLastCreatedParticipantId,
	selectParticipantsActionLoading,
	selectParticipantsInStore,
	ParticipantEditPageRequested,
	selectIsSuccess
} from './../../../core/auth';
import { ParticipantService } from './../../../core/_services';
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
// import { GooglePlaceDirective } from 'src/app/core/_base/layout/directives/googleplace.directive';


@Component({
	selector: 'kt-participant-record-edit',
	templateUrl: './participant-record-edit.component.html',
	styleUrls: ['./participant-record-edit.component.scss'],
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
export class ParticipantRecordEditComponent implements OnInit, OnDestroy, AfterViewInit {
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
	hideTab: boolean = false;
	NDISvalid = "[43]{2}[A-Za-z0-9]{1,18}";
	maxDate: Date;
	message;
	addressValid: boolean = true;
	hasSecondaryCarer: boolean = false;
	itemFocus:boolean =  false;
	addressResult: any;
	hasSchool: boolean = false;
	hasCarer: boolean = false;
	latitude: any;
	longitude: any;
	options =
	{
		types: [],
		componentRestrictions: { country: 'AU' }
	};

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private participantFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog,
		private auth: ParticipantService,
	) {
		this.maxDate = new Date();
	 }

	ngOnInit() {
		 this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id) {
				this.auth.getParticipantEditList(id).subscribe(res=>{
						if (res.data) {
						this.participant = res.data;
						this.addressResult = {
							streetName: this.participant.streetName,
							streetNumber: this.participant.streetNumber,
							unit: this.participant.unit,
							state: this.participant.state,
							city: this.participant.city,
							postCode: this.participant.postCode,
							formattedAddress: this.participant.address
						}

						if(res.data && res.data.custodians&& res.data.custodians.secondary.length>0){
							this.hasSecondaryCarer = true;
						}
						this.oldParticipant = Object.assign({}, this.participant);
						this.initParticipant();
						this.resetButton = true;
					}
				});

				// this.store.pipe(select(selectParticipantsInStore)).subscribe(res => {
				// 	if (res.items.length>0) {
				// 		this.participant = res.items[0];
				// 		this.addressResult = {
				// 			streetName: this.participant.streetName,
				// 			streetNumber: this.participant.streetNumber,
				// 			unit: this.participant.unit,
				// 			state: this.participant.state,
				// 			city: this.participant.city,
				// 			postCode: this.participant.postCode,
				// 			formattedAddress: this.participant.address
				// 		}
				// 		this.oldParticipant = Object.assign({}, this.participant);
				// 		this.initParticipant();
				// 		this.resetButton = true;
				// 	}
				// });
			}
		});
		// this.addressList();
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	ngAfterViewInit(): void {
		// Initialize form wizard
		// const wizard = new KTWizard(this.el.nativeElement, {
		// 	startStep: 1
		// });
		// const stages = new KTWizard(this.ele.nativeElement, {
		// 	startStep: 1
		// });
		// Validation before going to next page
		// wizard.on('beforeNext', function (wizardObj) {
			// https://angular.io/guide/forms
			// https://angular.io/guide/form-validation

			// validate the form and use below function to stop the wizard's step
			// wizardObj.stop();
			// return new FormGroup({
			// 	firstname: new FormControl('', [Validators.required]),
			// });
			// wizardObj.start();
		// });

		// Change event
		// wizard.on('change', function (wizard) {
		// 	setTimeout(function () {
		// 		KTUtil.scrollTop();
		// 	}, 500);
		// });

		// this.participantForm.controls['hasCarer'].setValue(this.participant.hasCarer);
		// this.carerSelected(this.participant.hasCarer);
	}

	initParticipant() {
		this.createEditForm();
		this.subheaderService.setTitle('Edit Client');
		// this.subheaderService.setBreadcrumbs([
		// 	{ title: 'Participant', page: `/participant-record/participants` }
		// ]);

		// this.carerSelected(this.participant.hasCarer);
		// this.currentCarer = this.participant.hasCarer;
	}

	createEditForm() {
		this.participantForm = this.participantFB.group({
			firstName: [this.participant.firstName, Validators.required],
			lastName: [this.participant.lastName, Validators.required],
			email: [this.participant.email, Validators.email],
			preferredName: [this.participant.preferredName],
			ndisNumber: [this.participant.ndisNumber, [Validators.required]],
			gender: [this.participant.gender, Validators.required],
			languageSpoken : [this.participant.language, Validators.required],
			dateOfBirth: [this.participant.dateOfBirth, Validators.required],
			// address: [this.addressResult, Validators.required],
			// streetNumber : [this.participant.streetNumber, Validators.required],
			// formattedAddress : [this.participant.address, ''],
			// state : [this.participant.state, Validators.required],
			// postCode : [this.participant.postCode, Validators.required],
			// city : [this.participant.city, Validators.required],
			// streetName : [this.participant.streetName, Validators.required],
			// unit : [this.participant.unit],
			clientAddress: this.participantFB.group({
				address: [this.participant.address.address],
				streetName: [this.participant.address.streetName, Validators.required],
				streetNumber: [this.participant.address.streetNumber, Validators.required],
				unit: [this.participant.address.unit],
				city: [this.participant.address.city, Validators.required],
				state: [this.participant.address.state, Validators.required],
				postalCode: [this.participant.address.postalCode, Validators.required],
				country: [this.participant.address.country],
				latitude: [this.participant.address.latitude],
				longitude: [this.participant.address.longitude],
				observations: [],
				addressType: [this.participant.address.addressType]
			}),

			primaryCustodians: this.participantFB.group({
				FirstName: [this.participant.custodians.primary && this.participant.custodians.primary.firstName],
				LastName: [this.participant.custodians.primary && this.participant.custodians.primary.lastName],
				email: [this.participant.custodians.primary && this.participant.custodians.primary.email],
				relation: [this.participant.custodians.primary && this.participant.custodians.primary.relation],
				contact: [this.participant.custodians.primary && this.participant.custodians.primary.contact]
			}),
			// hasSecondaryCarer: [this.participant.hasSecondaryCarer],
			secondaryCustodians: this.participantFB.array([ this.createSecondaryCustodians()]),
			hasSchool: [this.participant.hasSchool],
			schoolName : [this.participant.schoolName],
			// schoolAdress : [this.participant.schoolAddress],
			schoolAddress: this.participantFB.group({
				address: [this.participant.schoolAddress && this.participant.schoolAddress.address],
				streetName: [this.participant.schoolAddress && this.participant.schoolAddress.streetName],
				streetNumber: [this.participant.schoolAddress && this.participant.schoolAddress.streetNumber],
				unit: [this.participant.schoolAddress && this.participant.schoolAddress.unit],
				city: [this.participant.schoolAddress && this.participant.schoolAddress.city],
				state: [this.participant.schoolAddress && this.participant.schoolAddress.state],
				postalCode: [this.participant.schoolAddress && this.participant.schoolAddress.postalCode],
				country: [this.participant.schoolAddress && this.participant.schoolAddress.country],
				latitude: [this.participant.schoolAddress && this.participant.schoolAddress.latitude ? this.participant.schoolAddress.latitude : 0 ],
				longitude: [this.participant.schoolAddress && this.participant.schoolAddress.longitude?  this.participant.schoolAddress.longitude : 0],
				observations: [],
				addressType: [this.participant.schoolAddress && this.participant.schoolAddress.addressType]
			}),
			schoolTeacherName : [this.participant.schoolTeacherName],
			schoolPrimaryContact : [this.participant.schoolPrimaryContact],
			schoolContactNumber : [this.participant.schoolContactNumber],
			schoolEmail : [this.participant.schoolEmail],
			schoolTeacherEmail : [this.participant.schoolTeacherEmail],
			hasSecondaryCarer: [this.hasSecondaryCarer],
			billingDetails: this.participantFB.group({
				accountNumber: [ this.participant.billingDetails && this.participant.billingDetails.accountNumber],
				email: [this.participant.billingDetails && this.participant.billingDetails.email],
				address: this.participantFB.group({
					observations:[this.participant.billingDetails && this.participant.billingDetails.address.observations],
					unit:[this.participant.billingDetails && this.participant.billingDetails.address.unit],
					streetNumber:[this.participant.billingDetails && this.participant.billingDetails.address.streetNumber],
					streetName:[this.participant.billingDetails && this.participant.billingDetails.address.streetName],
					city:[this.participant.billingDetails && this.participant.billingDetails.address.city],
					state:[this.participant.billingDetails && this.participant.billingDetails.address.state],
					postalCode:[this.participant.billingDetails && this.participant.billingDetails.address.postalCode],
					latitude:[this.participant.billingDetails && this.participant.billingDetails.address.latitude],
					longitude:[this.participant.billingDetails && this.participant.billingDetails.address.longitude]
				  })

			}),
		});
	}

	createSecondaryCustodians(): FormGroup {
		return this.participantFB.group({
		  FirstName: this.participant.custodians.secondary[0] && this.participant.custodians.secondary[0].firstName,
		  LastName: this.participant.custodians.secondary[0] && this.participant.custodians.secondary[0].lastName,
		  email:  this.participant.custodians.secondary[0] && this.participant.custodians.secondary[0].email,
		  contact: this.participant.custodians.secondary[0]&& this.participant.custodians.secondary[0].contact,
		  relation: this.participant.custodians.secondary[0] &&this.participant.custodians.secondary[0].relation
		});
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
		if (this.participantForm && this.participantForm.invalid) {
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
		const editedParticipant = this.prepareParticipant();

		if (editedParticipant.id) {
			this.updateParticipant(editedParticipant, withBack);
			return;
		}
	}


	prepareParticipant(): Participant {
		const controls = this.participantForm.controls;
		const _participant = new Participant();
		_participant.clear();
		if (controls['primaryCustodians'].value["email"] === '' || controls['primaryCustodians'].value["email"] === null) {
			this.hasCarer = false;
		}else{
			this.hasCarer = true;
		}

		if ( (controls['secondaryCustodians'].value[0]['email'] === '' ||  controls['secondaryCustodians'].value[0]['email'] === null) || ( controls['secondaryCustodians'].value[0]['email'] !== '' && this.hasSecondaryCarer == false)) {
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
		_participant.dateOfBirth = controls['dateOfBirth'].value;
		_participant.hasCarer = this.hasCarer;

		//school
		_participant.schoolName = controls['schoolName'].value;
		// _participant.schoolAddress = controls['schoolAdress'].value;
		_participant.schoolTeacherName = controls['schoolTeacherName'].value;
		_participant.schoolPrimaryContact = controls['schoolPrimaryContact'].value;
		_participant.schoolContactNumber = controls['schoolContactNumber'].value;
		_participant.schoolEmail = controls['schoolEmail'].value;
		_participant.schoolTeacherEmail = controls['schoolTeacherEmail'].value;
		// Address
		// _participant.address = this.addressResult.formattedAddress;
		// _participant.unit = this.addressResult.unit;
		// _participant.state = this.addressResult.state;
		// _participant.city = this.addressResult.city;
		// _participant.postCode = this.addressResult.postCode;
		// _participant.streetNumber = this.addressResult.streetNumber;
		// _participant.streetName = this.addressResult.streetName;

		// _participant.address = controls['formattedAddress'].value;
		// _participant.unit = controls['unit'].value;
		// _participant.state = controls['state'].value;
		// _participant.city = controls['city'].value;
		// _participant.postCode = controls['postCode'].value;
		// _participant.streetNumber = controls['streetNumber'].value;
		// _participant.streetName = controls['streetName'].value;
		// _participant.latitude = this.latitude;
		// _participant.longitude = this.longitude;
		_participant.address = controls['clientAddress'].value;
		_participant.schoolAddress = controls['schoolAddress'].value;
		_participant.billingDetails = controls['billingDetails'].value;
		return _participant;
	}

	carerSelected(value) {
		this.currentCarer = value;
	}

	secondaryCarerSelected(value){
		if(value){
			this.hasSecondaryCarer = value;
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

	updateParticipant(_participant: Participant, withBack: boolean = false) {

		const updatedParticipant: Update<Participant> = {
			id: _participant.id,
			changes: _participant
		};

		this.store.dispatch(new ParticipantUpdated({
			partialParticipant: updatedParticipant,
			participant: _participant
		}));

		this.store.pipe(select(selectIsSuccess)).subscribe(success => {
			if(success){
				const message = `Client changes have been saved`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
				this.goBackWithId();
			}
		})
	}

	getComponentTitle() {
		let result = 'Create Client';
		if (!this.participant || !this.participant.id) {
			return result;
		}

		result = `${this.participant.firstName} ${this.participant.lastName}`;
		return result;
	}

/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	editParticipant(id) {
		this.router.navigate(['../participant-record/edit', id], { relativeTo: this.activatedRoute });
	}

	addInformation(participantDetails) {
		participantDetails.id = this.participantExist[0].id;
		this.participantTempDialog.close();
		this.updateParticipant(participantDetails, true);
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

	back(){
		this.selectedTab = this.selectedTab-1;
		if(this.selectedTab == -1){
			const url = `/participant-record/participants`;
				this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
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
		billingControls.address.controls.observations.setValue( address.formatted_address);
		address.address_components.forEach(res=>{
			res.types.includes("street_number")?billingControls.address.controls.streetNumber.setValue(res.long_name): "";
			res.types.includes("route")?billingControls.address.controls.streetName.setValue(res.long_name): "";
			res.types.includes("administrative_area_level_2")?billingControls.address.controls.city.setValue(res.long_name): "";
			res.types.includes("administrative_area_level_1")?billingControls.address.controls.state.setValue(res.long_name): "";
			res.types.includes("postal_code")?billingControls.address.controls.postalCode.setValue(res.long_name):"";
			billingControls.address.controls.latitude.setValue( address.geometry.location.lat());
			billingControls.address.controls.longitude.setValue(address.geometry.location.lng());
	   })
}
}
