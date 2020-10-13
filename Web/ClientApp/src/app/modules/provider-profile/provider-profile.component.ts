import { Component, OnInit } from '@angular/core';
import { selectParticipantById, selectProfileEditPage, selectParticipantsActionLoading, MedicationsPageRequested, selectMedicationByParticipantId, MedicationDeleted, AllergyPageRequested, selectAllergiesByParticipantId, AllergyDeleted, BudgetPageRequested, selectBudgetByParticipantId, BudgetDeleted, MedicationDataSource, AllergyDataSource, ParticipantsPageRequested, ParticipantProfilePageRequested, selectParticipantsInStore, ProfileEditPageRequested, Profile } from './../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../core/reducers';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryParamsModel } from './../../core/_base/crud';
import { LayoutUtilsService, MessageType } from './../../core/_base/crud';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubheaderService, LayoutConfigService } from './../../core/_base/layout';
import { ProfilePictureDialogComponent } from './provider-profile-picture/provider-profile-picture.component';
import { CommunicationService } from './communication.service';

@Component({
	selector: 'kt-provider-profile',
	templateUrl: './provider-profile.component.html',
	styleUrls: ['./provider-profile.component.scss']
})
export class ProviderProfileComponent implements OnInit {
	profile: Profile;

	constructor(
		private store: Store<AppState>,
		private router: Router,
		private subheaderService: SubheaderService,
		private profileFB: FormBuilder,
		private communicationService: CommunicationService,
		private activatedRoute: ActivatedRoute,
		private layoutUtilsService: LayoutUtilsService,
		private dialog: MatDialog
	) {
		communicationService.changeEmitted$.subscribe(data => {
			// here fetch data from the session storage
			this.getProfileData();
		  })
	}

	ngOnInit() {
		this.getProfileData();
	}

	getProfileData(){
		this.store.dispatch(new ProfileEditPageRequested({}));
		this.store.pipe(select(selectProfileEditPage)).subscribe(res => {
			if (res) {
				this.profile = res;
			}
		})
	}

	/**
 * Open Upload Dialog
 *
 */
	openUploadDialog() {
		const _saveMessage = ``;
		const _messageType = 2;
		const dialogRef = this.dialog.open(ProfilePictureDialogComponent, { data: { profile: this.profile } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
		});
	}

}
