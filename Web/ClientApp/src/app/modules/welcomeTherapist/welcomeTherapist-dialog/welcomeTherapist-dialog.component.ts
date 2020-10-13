import { Component, OnInit, ViewChild } from '@angular/core';
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
import { selectParticipantById, Participant, ParticipantUpdated, InitRegistration, selectInitRegistration, RegistrationComplete, selectRegistrationComplete} from './../../../core/auth';
import { Update } from '@ngrx/entity';
import { Router } from '@angular/router';


@Component({
	selector: 'kt-welcome-dialog',
	templateUrl: './welcomeTherapist-dialog.component.html',
	styleUrls: ['./welcomeTherapist-dialog.component.scss'],
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
export class WelcomeTherapistDialogComponent implements OnInit {
	isLinear = false;
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	participant: any;
	currentCarer: any;
	hasFormErrors: boolean = false;
	participantId: any;
	returnUrl = '/';
	@ViewChild('pickre', {static: true}) datePicker: MatDatepicker<Date>;

	constructor(
		private _formBuilder: FormBuilder,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		) {
			// this.participantId = JSON.parse(localStorage.getItem('user_data')).user_id;
		 }

	ngOnInit() {
		this.firstFormGroup = this._formBuilder.group({
			firstname: ['', Validators.required],
			lastname: ['', Validators.required],
			gender: ['', Validators.required],			
		});

		this.store.dispatch(new InitRegistration({participant: {} }));
		this.store.pipe(select(selectInitRegistration)).subscribe(res => {
				if (res) {
				this.participant = res;
				this.firstFormGroup = this._formBuilder.group({
					firstname: [this.participant.firstName, Validators.required],
					lastname: [this.participant.lastName, Validators.required],
					gender: [this.participant.gender, Validators.required],
					// dateOfBirth: [this.participant.dateOfBirth, Validators.required],
					// carer: [this.participant.carer, Validators.required],
					// carerFirstName: [this.participant.carerFirstName],
					// carerLastName: [this.participant.carerLastName],
					// carerEmail: [this.participant.carerEmail],
					// carerContact: [this.participant.carerContact],
					// carerRelation: [this.participant.carerRelation],
				});
			}
	})

		// this.store.pipe(select(selectParticipantById(this.participantId))).subscribe(res => {
		// 	if (res) {
		// 		this.participant = res;
		// 		this.firstFormGroup = this._formBuilder.group({
		// 			firstname: [this.participant.firstName, Validators.required],
		// 			lastname: [this.participant.lastName, Validators.required],
		// 			preferredname: [this.participant.preferredName],
		// 			gender: [this.participant.gender, Validators.required],
		// 			dateOfBirth: [this.participant.dateOfBirth, Validators.required],
		// 			carer: [this.participant.carer, Validators.required],
		// 			carerFirstName: [this.participant.carerFirstName],
		// 			carerLastName: [this.participant.carerLastName],
		// 			carerEmail: [this.participant.carerEmail],
		// 			carerContact: [this.participant.carerContact],
		// 			carerRelation: [this.participant.carerRelation],
		// 		});
		// 	}
		// });

		this.prepareParticipant();
		this.carerSelected(this.participant.carer);
	}

	carerSelected(value) { 

		this.currentCarer = value;
	}

	prepareParticipant(): Participant {
		const controls = this.firstFormGroup.controls;
		const _participant = new Participant();
		_participant.clear();
		// _participant.id = this.participant.id;
		_participant.firstName = controls['firstname'].value;
		_participant.lastName = controls['lastname'].value;
		// _participant.preferredName = controls['preferredname'].value;
		_participant.gender = controls['gender'].value;
		// _participant.dateOfBirth = controls['dateOfBirth'].value;
		// _participant.carer = controls['carer'].value;
		// _participant.carerFirstName = controls['carerFirstName'].value;
		// _participant.carerLastName = controls['carerLastName'].value;
		// _participant.carerEmail = controls['carerEmail'].value;
		// _participant.carerContact = controls['carerContact'].value;
		// _participant.carerRelation = controls['carerRelation'].value;
		return _participant;
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.firstFormGroup.controls;

		const editedParticipant = this.prepareParticipant();
		this.addWelcomeData(editedParticipant);

	}

	addWelcomeData(registrationData){
			this.store.dispatch(new RegistrationComplete({registrationData: registrationData }));
			this.store.pipe(select(selectRegistrationComplete)).subscribe(res => {
				// if(res.success){
					const message = `Thanks for filling out the welcome page !`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
					this.router.navigateByUrl(this.returnUrl + 'dashboard');

				// }
			})
		
		}
	
		// 	this.store.dispatch(new ParticipantUpdated({
		// 		partialParticipant: updatedParticipant,
		// 		participant: _participant
		// 	}));
		// 	const message = `Thanks for filling out the welcome page !`;
		// 	this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);

		// 	this.router.navigateByUrl(this.returnUrl + 'dashboard');
		// }
	}


		// updateParticipant(_participant: Participant, withBack: boolean = false) {
		// 	const updatedParticipant: Update<Participant> = {
		// 		id: _participant.id,
		// 		changes: _participant
		// 	};
		// 	this.store.dispatch(new ParticipantUpdated({
		// 		partialParticipant: updatedParticipant,
		// 		participant: _participant
		// 	}));
		// 	const message = `Thanks for filling out the welcome page !`;
		// 	this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);

		// 	this.router.navigateByUrl(this.returnUrl + 'dashboard');
		// }

