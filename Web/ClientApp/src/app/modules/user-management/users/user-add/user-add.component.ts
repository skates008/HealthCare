// Angular
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '.././../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService, BackButtonDirective } from '.././../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '.././../../../core/_base/crud';
// Services and Models
import {
	User,
	UserUpdated,
	Address,
	SocialNetworks,
	selectHasUsersInStore,
	selectUserById,
	UserOnServerCreated,
	selectLastCreatedUserId,
	selectUsersActionLoading,
	GetUserDetailsById,
	selectUsersInStore,
	RolesListRequested,
	selectRolesInStore,
	selectUserIsSuccess,
	TeamsPageRequested,
	selectTeamsInStore
} from '.././../../../core/auth';
import { Location } from '@angular/common';
import { MatAutocomplete, MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';

@Component({
	selector: 'kt-user-add',
	templateUrl: './user-add.component.html',
})
export class UserAddComponent implements OnInit, OnDestroy {

	// Public properties
	user: User;
	userId$: Observable<number>;
	oldUser: User;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	rolesSubject = new BehaviorSubject<number[]>([]);
	addressSubject = new BehaviorSubject<Address>(new Address());
	soicialNetworksSubject = new BehaviorSubject<SocialNetworks>(new SocialNetworks());
	userForm: FormGroup;
	hasFormErrors: boolean = false;
	roleslist: any;
	phonePattern = '';
	message;
	addressValid: boolean = true;

	// chip example
	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	subTeamCtrl = new FormControl();
	filteredsubTeams: Observable<string[]>;
	subTeams: string[] = ['Lemon'];
	allsubTeams: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
	selectedTherapist: any = [];
	subteamList: any;
	teamList: any;

	@ViewChild('subTeamInput', { static: false }) subTeamInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
	options =
		{
			types: [],
			componentRestrictions: { country: 'AU' }
		};

	addressResult: {
		streetName, streetNumber, state, unit, city, postCode, formatted_address
	}
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param userFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userFB: FormBuilder,
		private _location: Location,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService) {
		this.filteredsubTeams = this.subTeamCtrl.valueChanges.pipe(
			startWith(null),
			map((subTeam: string | null) => subTeam ? this._filter(subTeam) : this.allsubTeams.slice()));
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// this.loading$ = this.store.pipe(select(selectUsersActionLoading));
		this.loadRoles();
		this.loadTeam();

		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id) {
				this.store.dispatch(new GetUserDetailsById({ userId: id }));
				this.store.pipe(select(selectUsersInStore)).subscribe(res => {
					if (res) {
						this.user = res.data[0];
						this.oldUser = Object.assign({}, this.user);
						this.initUser();
					}
				});
			} else {
				this.user = new User();
				this.addressResult = {
					streetName: '',
					streetNumber: '',
					unit: 10,
					state: '',
					city: '',
					postCode: '',
					formatted_address: ''
				}
				this.user.clear();
				this.oldUser = Object.assign({}, this.user);
				this.initUser();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Init user
	 */
	initUser() {
		this.createForm();
		if (!this.user.id) {
			this.subheaderService.setTitle('New User');
			this.subheaderService.setBreadcrumbs([
				//{ title: 'User Management', page: `/user-management/users` },
				//	{ title: 'Create new user' }
			]);
			return;
		}
	}

	/**
	 * Create form
	 */
	createForm() {
		this.userForm = this.userFB.group({
			firstName: [this.user.firstName, Validators.required],
			lastName: [this.user.lastName, Validators.required],
			email: [this.user.email, [Validators.email, Validators.required]],
			phoneNumber: [this.user.phoneNumber, [Validators.required, Validators.pattern(this.phonePattern)]],
			companyName: [this.user.companyName],
			teams: this.userFB.array([
			]),
			occupation: [this.user.occupation, Validators.required],
			roleId: [this.user.roleId, Validators.required],
			userAddress: this.userFB.group({
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
				addressType: []
			}),
		});
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/user-management/users`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshUser(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/user-management/users/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.user = Object.assign({}, this.oldUser);
		this.createForm();
		this.hasFormErrors = false;
		this.userForm.markAsPristine();
		this.userForm.markAsUntouched();
		this.userForm.updateValueAndValidity();
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our subTeam
		if ((value || '').trim()) {
			this.subTeams.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}

		this.subTeamCtrl.setValue(null);
	}

	remove(subTeam: any): void {
		const index = this.selectedTherapist.findIndex(x => x.id === subTeam.id);

		if (index >= 0) {
			this.selectedTherapist.splice(index, 1);

			this.subteamList.push(subTeam);
		}
	}

	selected(event: any): void {
		const _obj = { id: event.option.value.id, name: event.option.value.name };
		this.selectedTherapist.push(_obj);
		this.subTeamInput.nativeElement.value = '';
		this.subTeamCtrl.setValue(null);

		let index = this.subteamList.findIndex(x => x.id === _obj.id);
		this.subteamList.splice(index, 1);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allsubTeams.filter(subTeam => subTeam.toLowerCase().indexOf(filterValue) === 0);
	}

	loadTeam() {
		let queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new TeamsPageRequested({ page: queryParams }));
		this.store.pipe(select(selectTeamsInStore)).subscribe(res => {

			if (res.total == 0) {
				return;
			}

			this.teamList = res.data;
			this.subteamList = Object.assign([], this.teamList);
		})
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedUser = this.prepareUser();

		if (editedUser.id > 0) {
			this.updateUser(editedUser, withBack);
			return;
		}

		this.addUser(editedUser, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): User {
		const controls = this.userForm.controls;
		const _user = new User();
		_user.clear();
		_user.id = this.user.id;
		// this.addressResult = controls['address'].value;
		_user.email = controls['email'].value;
		_user.firstName = controls['firstName'].value;
		_user.lastName = controls['lastName'].value;
		_user.occupation = controls['occupation'].value;
		_user.phoneNumber = controls['phoneNumber'].value;
		_user.companyName = controls['companyName'].value;
		// Address
		// _user.address = this.addressResult.formatted_address;
		// _user.unit = this.addressResult.unit;
		// _user.state = this.addressResult.state;
		// _user.city = this.addressResult.city;
		// _user.postCode = this.addressResult.postCode;
		// _user.streetNumber = this.addressResult.streetNumber;
		// _user.streetName = this.addressResult.streetName;
		// Address End
		_user.teams = this.selectedTherapist;
		_user.address = controls['userAddress'].value
		// _user.address = controls['formatted_address'].value;
		// _user.unit = controls['unit'].value;
		// _user.state = controls['state'].value;
		// _user.city = controls['city'].value;
		// _user.postCode = controls['postCode'].value;
		// _user.streetNumber = controls['streetNumber'].value;
		// _user.streetName = controls['streetName'].value;
		_user.roleId = controls['roleId'].value;
		return _user;
	}

	/**
	 * Add User
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	addUser(_user: User, withBack: boolean = false) {
		this.store.dispatch(new UserOnServerCreated({ user: _user }));
		const addSubscription = this.store.pipe(select(selectUserIsSuccess)).subscribe(success => {
			if (success) {
				const message = `New user successfully has been added.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
				this.goBackWithId();
			}
		});
		this.subscriptions.push(addSubscription);
	}

	/**
	 * Update user
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	updateUser(_user: User, withBack: boolean = false) {
		// Update User
		// tslint:disable-next-line:prefer-const

		const updatedUser: Update<User> = {
			id: _user.id,
			changes: _user
		};
		this.store.dispatch(new UserUpdated({ partialUser: updatedUser, user: _user }));
		const message = `User successfully has been saved.`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		if (withBack) {
			this.goBackWithId();
		} else {
			this.refreshUser(false);
		}
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'New User';
		if (!this.user || !this.user.id) {
			return result;
		}

		result = `Edit User - ${this.user.fullName}`;
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

	loadRoles() {
		this.store.dispatch(new RolesListRequested({}));
		this.store.pipe(select(selectRolesInStore)).subscribe(res => {
			this.roleslist = res.data;
		});
	}
	


	handleAddressChange(address) {
	
		let userAddressControls = this.userForm['controls'].userAddress['controls'];
		userAddressControls.streetNumber.reset();
		userAddressControls.streetName.reset();
		userAddressControls.city.reset();
		userAddressControls.state.reset();
		userAddressControls.postalCode.reset();
		userAddressControls.latitude.reset();
		userAddressControls.longitude.reset();

		userAddressControls.address.setValue(address.formatted_address);
		address.address_components.forEach(res => {
			res.types.includes('street_number') ? userAddressControls.streetNumber.setValue(res.long_name) : '';
			res.types.includes('route') ? userAddressControls.streetName.setValue(res.long_name) : '';
			res.types.includes('administrative_area_level_2') ? userAddressControls.city.setValue(res.long_name) : '';
			res.types.includes('administrative_area_level_1') ? userAddressControls.state.setValue(res.long_name) : '';
			res.types.includes('postal_code') ? userAddressControls.postalCode.setValue(res.long_name) : '';
			userAddressControls.latitude.setValue(address.geometry.location.lat());
			userAddressControls.longitude.setValue(address.geometry.location.lng());
		})
	}


	back() {
		this._location.back();
	}
}
