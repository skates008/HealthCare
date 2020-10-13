import {
	Component, OnInit, ViewChild, Inject,
	ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query
} from '@angular/core';
import { animate, state, style, transition, trigger, query } from '@angular/animations';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';

import {
	TherapyService,
	TherapyServiceDeleted,
	Participant,
	selectAllRoles,
	Role,
	ParticipantsPageRequested,
	TherapyServicesPageRequested,
	TherapyServiceDataSource,
	CareplansPageRequested
} from './../../../core/auth';
import { SubheaderService } from './../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { selectAllParticipants, selectParticipantsInStore } from './../../../core/auth/_selectors/participant.selectors';
import { selectCareplansInStore } from './../../../core/auth/_selectors/careplan.selectors';

@Component({
	selector: 'kt-therapistPlans-view',
	templateUrl: './therapistPlans-list.component.html',
	styleUrls: ['./therapistPlans-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class TherapyServicesListComponent implements OnInit, OnDestroy {
	// dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	dataSource: TherapyServiceDataSource;
	displayedColumns = ['id', 'startDate', 'endDate', 'participantName', 'familyGoal', 'status', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<TherapyService>(true, []);
	TherapyServicesResult: TherapyService[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];

	name: string;
	participants = [];

	allParticipants;
	allCareplans;
	ParticipantData;
	CareplanData;
	allRoles: Role[] = [];

	constructor(
		public dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		// load participants 
		this.loadParticipants();
		this.loadCareplan();

		// const participantsSubscription = this.store.pipe(select(selectAllParticipants)).subscribe(res => this.allParticipants = res);
		// this.subscriptions.push(participantsSubscription);

		// console.log('All Participants:', this.allParticipants)

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadTherapyServicesList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(150), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadTherapyServicesList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		this.subheaderService.setTitle('Therapy Service Summary Management');

		this.dataSource = new TherapyServiceDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.TherapyServicesResult = res;
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadTherapyServicesList();
		});
		// this.dataSource.sort = this.sort;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	//load participants
	loadParticipants() {
		let queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new ParticipantsPageRequested({ page: queryParams }));
		this.store.pipe(select(selectParticipantsInStore)).subscribe(res => {
			if (res.total == 0) {
				return;
			}

			this.allParticipants = res;

			if (this.allParticipants && this.allParticipants.items) {
				this.ParticipantData = this.allParticipants.items.map(participant => {
					return {
						id: participant.id,
						text: participant.firstName + " " + participant.lastName,
						firstName: participant.firstName,
						lastName: participant.lastName
					};
				})
			}
		})
	}

	//load careplans
	loadCareplan() {
		let queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new CareplansPageRequested({ page: queryParams }));
		this.store.pipe(select(selectCareplansInStore)).subscribe(res => {
			if (res.total == 0) {
				return;
			}

			this.allCareplans = res;

			if (this.allCareplans && this.allCareplans.items) {
				this.CareplanData = this.allCareplans.items.map(careplan => {
					return {
						id: careplan.id,
						title: careplan.title,
					};
				})
			}

		})
	}

	loadTherapyServicesList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new TherapyServicesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.name = searchText;
		return filter;
	}

	deleteTherapyService(_item: TherapyService) {
		const _title: string = 'Therapy Service Summary Delete';
		const _description: string = 'Are you sure you want to permanently delete this Therapy Service Summary?';
		const _waitDescription: string = 'Therapy Service Summary is deleting..';
		const _deleteMessage: string = 'Therapy Service Summary has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new TherapyServiceDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	editTherapyService(id) {
		this.router.navigate(['../therapistPlans/edit', id], { relativeTo: this.activatedRoute });
	}

	viewTherapyService(id) {
		this.router.navigate(['../therapistPlan-details', id], { relativeTo: this.activatedRoute });
	}

	viewParticipant(id) {
		this.router.navigate(['../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
