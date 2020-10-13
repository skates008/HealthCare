import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { selectParticipantById, Participant, ParticipantUpdated } from './../../../core/auth';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Update } from '@ngrx/entity';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';

@Component({
	selector: 'kt-participant-profile-edit',
	templateUrl: './participant-profile-edit.component.html',
	styleUrls: ['./participant-profile-edit.component.scss']
})
export class ParticipantProfileEditComponent implements OnInit {
	participant: any;
	participantForm: FormGroup;
	hasFormErrors: boolean = false;
	selectedTab: number = 0;
	loading$: any;
	viewLoading: boolean = false;
  	loadingAfterSubmit: boolean = false;
	

	constructor(
		private store: Store<AppState>,
		private participantFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
	) { }

	ngOnInit() {
		this.store.pipe(select(selectParticipantById(1234))).subscribe(res => {
			if (res) {
				this.participant = res;
			}
		});
		this.createForm();
	}

	createForm() {
		this.participantForm = this.participantFB.group({
			firstname: [this.participant.firstName, Validators.required],
			lastname: [this.participant.lastName, Validators.required],
			preferredname: [this.participant.preferredName],
			gender: [this.participant.gender, Validators.required],
			dob: [this.participant.dob, Validators.required],
			cob: [this.participant.cob, Validators.required],
			ethnicity: [this.participant.ethnicity, Validators.required]
		});
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.participantForm.controls;

		if (this.participantForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const editedParticipant = this.prepareParticipant();

		if (editedParticipant.id > 0) {
			this.updateParticipant(editedParticipant, withBack);
			return;
		}
	}

	prepareParticipant(): Participant {
		const controls = this.participantForm.controls;
		const _participant = new Participant();
		_participant.clear();
		_participant.id = this.participant.id;
		_participant.firstName = controls['firstname'].value;
		_participant.lastName = controls['lastname'].value;
		_participant.preferredName = controls['preferredname'].value;
		_participant.gender = controls['gender'].value;
		_participant.dateOfBirth = controls['dob'].value;
		return _participant;
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
		const message = `Participant changes have been saved`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
	}

}
