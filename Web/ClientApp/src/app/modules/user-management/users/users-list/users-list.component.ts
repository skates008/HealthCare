import { AfterViewInit, AfterViewChecked } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '.././../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '.././../../../core/_base/crud';
// Models
import {
	User,
	Role,
	UsersDataSource,
	UserDeleted,
	UsersPageRequested,
	selectUserById,
	selectAllRoles
} from '.././../../../core/auth';
import { SubheaderService } from '.././../../../core/_base/layout';
import { UserViewDialogComponent } from '../user-view/user-view.dialog.component';

@Component({
	selector: 'kt-users-list',
	templateUrl: './users-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: UsersDataSource;
	displayedColumns = ['firstname', 'lastname',  'email', 'roles', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<User>(true, []);
	usersResult: User[] = [];
	allRoles: Role[] = [];
	hasCurrentProfile: boolean = false;
	currentUserId: string;

	// Subscriptions
	private subscriptions: Subscription[] = [];

	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.currentUserId = JSON.parse(localStorage.getItem('user_data')).user_details.loginInfo.userId;

		// load roles list
		const rolesSubscription = this.store.pipe(select(selectAllRoles)).subscribe(res => this.allRoles = res);
		this.subscriptions.push(rolesSubscription);

		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadUsersList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(1500), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadUsersList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		this.subheaderService.setTitle('Users');

		// Init DataSource
		this.dataSource = new UsersDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.usersResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadUsersList();
		});

	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load users list
	 */
	loadUsersList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new UsersPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.name = searchText;
		return filter;
	}

	goToProfile() {
		const url = `/profile/personal`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/** ACTIONS */
	/**
	 * Delete user
	 *
	 * @param _item: User
	 */
	deleteUser(item: User) {
		const title: string = 'User Delete';
		const description: string = 'Are you sure to permanently delete this user?';
		const waitDesciption: string = 'User is deleting...';
		const deleteMessage = `User has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new UserDeleted({ id: item.id }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
		});
	}

	/**
	 * Fetch selected rows
	 */
	fetchUsers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.fullName}, ${elem.email}`,
				id: elem.id.toString(),
				status: elem.username
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Edit user
	 *
	 * @param user: User
	 */
	viewUser(user: User) {
		const saveMessage = ``;
		const messageType = 2;
		const dialogRef = this.dialog.open(UserViewDialogComponent, { data: { user: user.id } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType, 10000, true, true);
		});
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.usersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.usersResult.length) {
			this.selection.clear();
		} else {
			this.usersResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns user roles string
	 *
	 * @param user: User
	 */
	getUserRolesStr(user: User): string {
		const titles: string[] = [];
		each(user.roles, (roleId: number) => {
			const role = find(this.allRoles, (role: Role) => role.id === roleId);
			if (role) {
				titles.push(role.title);
			}
		});
		return titles.join(', ');
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
