// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User, ProfileEditPageRequested, selectProfileEditPage, Profile } from '../../../../../core/auth';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;
	loggedInUser: any;
	profile: Profile;

	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>,
		private router: Router,
		private activatedRoute: ActivatedRoute) {

			this.store.pipe(select(currentUser)).subscribe((response) => {
					this.loggedInUser = response;
				});
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
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.getProfileData();
		this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * Log out
	 */
	logout() {
		this.store.dispatch(new Logout());
	}

	goTomyTask() {
		this.router.navigate(["../tasks/tasks"]);
	}

	myProfile() {		
			switch (this.loggedInUser.role) {
				case 'Owner':
				case 'Manager':
						this.router.navigate(['../' + 'profile/personal']);
					break;
					
				case 'User':
						this.router.navigate(['../' + 'therapist-profile/view']);
					break;

				case 'Client':
						this.router.navigateByUrl('../' + 'participant-profile/view');
					break;
					
				default:
					this.router.navigateByUrl('error/403');
					break;
			}

	}
}
