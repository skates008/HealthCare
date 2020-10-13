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
	Careplan,
	CareplanDataSource,
	CareplanDeleted,
	CareplansPageRequested,
	Participant,
	selectAllRoles,
	Role,
	ParticipantsPageRequested,
	BudgetPageRequested
} from './../../../core/auth';
import { SubheaderService } from './../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { selectAllParticipants, selectParticipantsInStore } from './../../../core/auth/_selectors/participant.selectors';

@Component({
	selector: 'kt-careplans-view',
	templateUrl: './careplans-list.component.html',
	styleUrls: ['./careplans-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class CareplansListComponent implements OnInit, OnDestroy {
	// dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	dataSource: CareplanDataSource;
	displayedColumns = ['select', 'id', 'created', 'status', 'category', 'Practitioner', 'Practice', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<Careplan>(true, []);
	CareplansResult: Careplan[] = [];

	// Subscriptions
	private subscriptions: Subscription[] = [];

	name: string;
	category = [{ id: 123, name: 'Medium Careplan 1' }, { id: 124, name: 'Advanced Careplan 2' }, { id: 125, name: 'Careplan 3' }];
	participants = [{ id: 1234, name: 'Dave Newman' }, { id: 1235, name: 'Sohal Rana' }, { id: 1236, name: 'Gustavo Sessa' }];

	allParticipants;
	ParticipantData;
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
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new BudgetPageRequested({ page: queryParams, participant_id: 1234 }));


		// const participantsSubscription = this.store.pipe(select(selectAllParticipants)).subscribe(res => this.allParticipants = res);
		// this.subscriptions.push(participantsSubscription);

		// console.log('All Participants:', this.allParticipants)

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadCareplansList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(150), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadCareplansList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		this.subheaderService.setTitle('Careplan Management');

		this.dataSource = new CareplanDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.CareplansResult = res;
			let _CareplansResult: any = [];
			const participantId = JSON.parse(localStorage.getItem('user_data')).user_id;
			//const participantId = 1234;
			this.CareplansResult.map(function (v) {
				if (v.participant === participantId) {
					_CareplansResult.push(v);
				}

				else {
					_CareplansResult = [];
				}
			});

			this.CareplansResult = _CareplansResult;
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadCareplansList();
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

	loadCareplansList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new CareplansPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.name = searchText;
		return filter;
	}

	deleteCareplan(_item: Careplan) {
		const _title: string = 'Careplan Delete';
		const _description: string = 'Are you sure you want to permanently delete this Careplan?';
		const _waitDescription: string = 'Careplan is deleting..';
		const _deleteMessage: string = 'Careplan has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new CareplanDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
		});
	}

	fetchCareplans() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.category}, ${elem.description}`,
				id: elem.id.toString()
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.CareplansResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.CareplansResult.length) {
			this.selection.clear();
		} else {
			this.CareplansResult.forEach(row => this.selection.select(row));
		}
	}

	getCategoryStr(id: number): string {
		let _name: string = '';
		this.category.forEach(function (v) {
			if (v.id === id) {
				_name = v.name
			}
		});
		return _name;
	}

	getParticipantStr(id: number): string {
		let _name: string = '';
		this.ParticipantData.forEach(function (v) {
			if (v.id === id) {
				_name = v.text
			}
		});
		return _name;
	}

	editCareplan(id) {
		this.router.navigate(['../Careplans/edit', id], { relativeTo: this.activatedRoute });
	}

	// viewCareplan(id) {
	// 	this.router.navigate(['../careplan-details', id], { relativeTo: this.activatedRoute });
	// }
	viewCareplan(Careplan) {
		this.router.navigate(['../careplan-details', Careplan.id], { relativeTo: this.activatedRoute , state : {
			Careplan: Careplan
		}});
	}

	viewParticipant(id) {
		this.router.navigate(['../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
