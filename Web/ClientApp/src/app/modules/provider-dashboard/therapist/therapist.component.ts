// Angular
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
// RXJS
import { tap, skip, distinctUntilChanged, take, delay } from 'rxjs/operators';
import { merge, Subscription, of } from 'rxjs';
// Crud
import { QueryParamsModel } from './../../../core/_base/crud';
// Layout
import { DataTableItemModel, DataTableService } from './../../../core/_base/layout';
import {
	ParticipantsPageRequested,
	ParticipantDataSource,
	Participant,
	AppointmentsPageRequested,
	UsersPageRequested,
	UsersDataSource,
	User
} from './../../../core/auth';
import { AppState } from './../../../core/reducers';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'kt-data-therapist',
	templateUrl: './therapist.component.html',
	styleUrls: ['./therapist.component.scss']
})

export class DataTherapistComponent implements OnInit {
	// Public properties
	private subscriptions: Subscription[] = [];
	dataSource: UsersDataSource;
	therapistsResult: User[] = [];
	displayedColumns = ['id', 'fullname', '_roles', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	selection = new SelectionModel<DataTableItemModel>(true, []);
	bookedAppointments: any;
	therapisthasItems: boolean = false;
	currentUserId: string;

	/**
	 * Component constructor
	 *
	 * @param dataTableService: DataTableService
	 */
	constructor(
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
		this.currentUserId = JSON.parse(localStorage.getItem('user_data')).user_details.loginInfo.userId;

		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadTherapistsList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Init DataSource
		this.dataSource = new UsersDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.therapistsResult = res;
			if (this.therapistsResult.length == 0) {
				this.therapisthasItems = false;
			} else {
				this.therapisthasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadTherapistsList();
		});
	}


	loadTherapistsList() {
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

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = '';
		filter.name = searchText;
		return filter;
	}


	goToProfile() {
		const url = `/profile/personal`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	editUser(id) {
		this.router.navigate(['../user-management/users/edit', id], { relativeTo: this.activatedRoute });
	}

}
