import {
	Component, OnInit, ViewChild,
	ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Input
} from '@angular/core';
import { animate, state, style, transition, trigger, query } from '@angular/animations';
import { MatSort, MatDialog, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, of, Subscription } from 'rxjs';

import {
	Time,
	TimeDataSource,
	TimeDeleted,
	TimesPageRequested,
	selectTimesInStore,
} from '../../../../core/auth';
import { SubheaderService } from '../../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { TimeEntryAddComponent } from '../../../../modules/timeEntry/timeEntry-add/timeEntry-add.component';
import { ParticipantService } from '../../../../core/_services/participant.service';

@Component({
	selector: 'kt-participant-time',
	templateUrl: './timeEntry.component.html',
	styleUrls: ['./timeEntry.component.scss'],
})

export class TimeEntryComponent implements OnInit, OnDestroy {
	dataSource: TimeDataSource;
	displayedColumnsTimeEntry = ['name', 'createdByUserName', 'createdDate', 'totalCost', 'carePlanName', 'actions'];
	@Input() ndisNumber: string;

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	lastQuery: QueryParamsModel;
	timeEntry: Time[] = [];
	timeEntryhasItems = false;
	participantDetails: any;
	participantId: string;

	// Subscriptions
	private subscriptions: Subscription[] = [];

	constructor(
		public dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private participantData: ParticipantService,
		private cdr: ChangeDetectorRef) { }

	ngOnInit() {

		this.activatedRoute.params.subscribe(
			params => {
				this.participantId = params["id"];
				this.loadParticipantDetails(this.participantId);
		})
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadTimeEntries();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		this.dataSource = new TimeDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.timeEntry = res;
			if (this.timeEntry.length === 0) {
				this.timeEntryhasItems = false;
			} else {
				this.timeEntryhasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadTimeEntries();
		});

		

		
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadTimeEntries() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		this.store.dispatch(new TimesPageRequested({
			page: queryParams
		}));
	}

	filterConfiguration(): any {
		const filter: any = {};
		filter.name = this.ndisNumber;
		return filter;
	}

	viewTimeEntry(id) {
		this.router.navigate(['../../../../times/timeEntry-details', id], { relativeTo: this.activatedRoute });
	}

	deleteTime(item: Time) {
		const title = 'Time Entry Delete';
		const description = 'Are you sure you want to permanently delete this Time Entry?';
		const waitDescription = 'Time Entry is deleting..';
		const deleteMessage = 'Time Entry has been deleted';

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDescription);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new TimeDeleted({ id: item.id }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
		});
	}

		addTimeEntry(){
			const dialogRefEvenet = this.dialog.open(TimeEntryAddComponent, {
			  width: "800px",
			  data: { participantDetails:this.participantDetails, "dialogOpenForTime": true }
			});
			dialogRefEvenet.afterClosed().subscribe(res => {
			  if (res.dialogTimeEntry) {
				  this.loadTimeEntries();
			  }
		
			});
		  }

		  loadParticipantDetails(id){
			this.participantData.getParticipantById(id).subscribe(res=>{
				this.participantDetails = res.data;
			});
		}

}
