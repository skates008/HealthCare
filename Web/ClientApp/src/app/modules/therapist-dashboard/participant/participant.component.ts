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
	CareplanParticipantsPageRequested,
	ParticipantDataSource,
	Participant,
	AppointmentsPageRequested
} from './../../../core/auth';
import { AppState } from './../../../core/reducers';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'kt-data-participant-therapist',
	templateUrl: './participant.component.html',
	styleUrls: ['./participant.component.scss']
})
export class DataParticipantComponent implements OnInit {
	// Public properties
	private subscriptions: Subscription[] = [];
	dataSource: ParticipantDataSource;
	participantsResult: Participant[] = [];
	displayedColumns = ['id', 'name', 'ndisnumber', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	selection = new SelectionModel<DataTableItemModel>(true, []);
	bookedAppointments: any;

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

		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadParticipantsList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Init DataSource
		this.dataSource = new ParticipantDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.participantsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadParticipantsList();
		});
	}


	loadParticipantsList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new CareplanParticipantsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = '';
		filter.name = searchText;
		return filter;
	}


	viewParticipant(id) {
		this.router.navigate(['../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}

}
