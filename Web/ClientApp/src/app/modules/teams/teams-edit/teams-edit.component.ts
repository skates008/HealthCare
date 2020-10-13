import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, NgModule, OnDestroy, Inject, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
// import { selectUsersActionLoading, selectUserById, User } from 'src/app/core/auth';
// import { UseExistingWebDriver } from 'protractor/built/driverProviders';

import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';

// Services and Models
import {
	Team,
	TeamUpdated,
	selectHasTeamsInStore,
	selectTeamById,
	TeamOnServerCreated,
	selectLastCreatedTeamId,
	selectTeamsActionLoading,
	ParticipantsPageRequested,
	selectParticipantsInStore,
	Notification,
	NotificationOnServerCreated,
	selectTeamCreatedSuccess,
	TeamsPageRequested,
	selectTeamsInStore,
	PractitionerPageRequested,
	selectPractitionerInStore
} from './../../../core/auth';
import { AppState } from './../../../core/reducers';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from './../../../core/_base/crud';

import { MatDatepicker, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatChipInputEvent } from '@angular/material';

import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


@Component({
	selector: 'kt-teams-edit',
	templateUrl: './teams-edit.component.html',
	styleUrls: ['./teams-edit.component.scss'],
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
export class TeamsEditComponent implements OnInit, OnDestroy {

	constructor(
		private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private router: Router,
		private teamFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			this.appointmentDetails = this.router.getCurrentNavigation().extras.state;
		}
	}

		// chip example
		visible = true;
		selectable = true;
		removable = true;
		separatorKeysCodes: number[] = [ENTER, COMMA];
		subPractitionerCtrl = new FormControl();
		hideTab = false;
		filteredsubPractitioners: Observable<string[]>;
		subPractitioners: string[] = [];
		allsubPractitioners: string[] = [];
		selectedTherapist: any = [];
		practitionerList: any;
		subpractitionerList: any;

		@ViewChild('subPractitionerInput', { static: false }) subPractitionerInput: ElementRef<HTMLInputElement>;
		@ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;


	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('stages', { static: true }) ele: ElementRef;

	team: Team;
	oldTeam: Team;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	teamForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	appointmentDetails: object;
	participantList: any;
	resetButton: boolean = true;
	@Output() onItemAdd: EventEmitter<any> = new EventEmitter<any>();

	ngOnInit() {
		this.loadPractitioner();
		this.loading$ = this.store.pipe(select(selectTeamsActionLoading));
		this.team = new Team();
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id) {
				this.store.pipe(select(selectTeamById(id))).subscribe(res => {
					if (res) {
						this.team = res;
						this.oldTeam = Object.assign({}, this.team);
						this.initTeam();
						this.team.users.forEach(function(v) {
							this.selectedTherapist.push({ id: v.id, text: v.name });
							let index = this.subpractitionerList.findIndex(x => x.id === v.id);
							this.subpractitionerList.splice(index, 1);
							// const _formarr = this.careplanForm.get("practitioners") as FormArray;
							// _formarr.push(this.careplanFB.group(v));
						}.bind(this));
						this.resetButton = true;
					}
				});
			} else {
				this.team.clear();
				this.oldTeam = Object.assign({}, this.team);
				this.initTeam();
				this.resetButton = false;
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initTeam() {
		this.createForm();
		if (!this.team.id) {
			this.subheaderService.setTitle('New Team');
			return;
		}
		this.subheaderService.setTitle('Edit Team');
	}

	createForm() {
		this.teamForm = this.teamFB.group({
			name: [this.team.name]
		});
	}

	goBackWithId() {
		const url = `/teams/teams`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.teamForm.controls;
		if (this.teamForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const editedTeam = this.prepareTeam();

		if (editedTeam.id) {
			this.updateTeam(editedTeam, withBack);
			return;
		}

		this.addTeam(editedTeam, withBack);
	}

	prepareTeam(): Team {
		const controls = this.teamForm.controls;
		const _team = new Team();
		_team.clear();
		_team.name = controls['name'].value;
		_team.id = this.team.id;
		_team.users = this.selectedTherapist;
		return _team;
	}

	addTeam(_team: Team, withBack: boolean = false) {
		this.store.dispatch(new TeamOnServerCreated({ team: _team }));
		const addSubscription = this.store.pipe(select(selectTeamCreatedSuccess)).subscribe(success => {
			if(success){
			const message = `New team successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			this.goBackWithId();
		}
		});
		this.subscriptions.push(addSubscription);
	}

	updateTeam(_team: Team, withBack: boolean = false) {
		const updatedTeam: Update<Team> = {
			id: _team.id,
			changes: _team
		};

		this.store.dispatch(new TeamUpdated({
			partialTeam: updatedTeam,
			team: _team
		}));
		this.store.pipe(select(selectTeamCreatedSuccess)).subscribe(success => {
			if (success) {
		const message = `Team changes have been saved`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		this.goBackWithId();
	   }});
	}

	getComponentTitle() {
		let result = 'Team';
		if (!this.team || !this.team.id) {
			return result;
		}

		result = `${this.team.name}`;
		return result;
	}

	/** Alect Close event */
	onAlertClose(any) {
		this.hasFormErrors = false;
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	loadPractitioner() {
		const queryParams = new QueryParamsModel(this.filterConfiguration());
		this.store.dispatch(new PractitionerPageRequested({ page: queryParams }));
		this.store.pipe(select(selectPractitionerInStore)).subscribe(res => {
			if (res.total === 0) {
				return;
			}
			this.practitionerList = res.data;
			this.subpractitionerList = Object.assign([], this.practitionerList);
		});
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our subPractitioner
		if ((value || '').trim()) {
			this.subPractitioners.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}

		this.subPractitionerCtrl.setValue(null);
	}

	remove(subPractitioner: any): void {
		const index = this.selectedTherapist.findIndex(x => x.id === subPractitioner.id);

		if (index >= 0) {
			this.selectedTherapist.splice(index, 1);

			this.subpractitionerList.push(subPractitioner);
		}

	}

	selected(event: any): void {
		const obj = { id: event.option.value.id, text: event.option.value.text };
		this.selectedTherapist.push(obj);
		this.subPractitionerInput.nativeElement.value = '';
		this.subPractitionerCtrl.setValue(null);

		const index = this.subpractitionerList.findIndex(x => x.id === obj.id);
		this.subpractitionerList.splice(index, 1);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allsubPractitioners.filter(subPractitioner => subPractitioner.toLowerCase().indexOf(filterValue) === 0);
	}

}
