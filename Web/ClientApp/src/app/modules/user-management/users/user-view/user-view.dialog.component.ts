// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Observable, of, Subscription} from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '.././../../../core/reducers';
// Services and Models
import {
	User,
	Permission,
	selectUserById,
	selectAllPermissions,
	RolesListRequested,
	selectRolesInStore,
} from '.././../../../core/auth';
import { delay } from 'rxjs/operators';
import { AuthService, UserService } from './../../../../core/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'kt-user-view-dialog',
	templateUrl: './user-view.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class UserViewDialogComponent implements OnInit, OnDestroy {
	// Public properties
	user: User;
	user$: Observable<User>;
	hasFormErrors = false;
	viewLoading = false;
	loadingAfterSubmit = false;
	allPermissions$: Observable<Permission[]>;
	userPermissions: Permission[] = [];
	roleslist;
	// Private properties
	private componentSubscriptions: Subscription;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<UserViewDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		public dialogRef: MatDialogRef<UserViewDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private auth: AuthService,
		private userService: UserService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		const id = this.data.user;
			if (id) {
				this.userService.getUserById(id).subscribe(res => {
					if (res) {
						this.user = res.data;
					}
				})
			}
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}




	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
			// tslint:disable-next-line:no-string-throw
			return `View user`;
	}

	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	editUser(id) {
		this.router.navigate(['../users/edit', id], { relativeTo: this.activatedRoute });
	}
}
