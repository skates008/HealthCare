import {
	Component, OnInit, ViewChild, Inject,
	ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';

import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';

import { each, find } from 'lodash';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';

import {
	Participant,
	ParticipantDataSource,
	ParticipantDeleted,
	ParticipantsPageRequested,
	selectParticipantById,
	selectAllRoles,
	Appointment
} from '../../../core/auth';
import { SubheaderService } from '../../../core/_base/layout';
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { ProviderAppointmentsAddComponent } from '../../provider-appointments/appointments-add/appointments-add.component';
import { UserNoteAddDialogComponent } from './note/note-add/note-add.dialog.component';

@Component({
	selector: 'kt-participant-record-view',
	templateUrl: './participant-record-view.component.html',
	styleUrls: ['./participant-record-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})

export class ParticipantRecordViewComponent implements OnInit, OnDestroy {
	dataSource: ParticipantDataSource;
	displayedParticipantColumns = ['NDIS', 'firstname', 'lastname', 'address', 'availableBudget', 'reviewDate', 'actions'];

	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	lastQuery: QueryParamsModel;
	selection = new SelectionModel<Participant>(true, []);
	participantsResult: Participant[] = [];

	private subscriptions: Subscription[] = [];
	name: string;
	// viewLoading: boolean = false;
	// loadingAfterSubmit: boolean = false;
	participanthasItems = false;

	constructor(
		public dialog: MatDialog,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private toastr: ToastrService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) { }


	openApptDialog(participant): void {
		const newAppointment = new Appointment();
		newAppointment.clear(); // Set all defaults fields

		const saveMessage = `Appointment successfully has been created.`;
		const dialogRef = this.dialog.open(ProviderAppointmentsAddComponent, { data: {  participantDetails: participant  } });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			this.toastr.success('Appointment successfully has been created', 'Success', {
				timeOut: 5000
			});
			this.name = result;
			}
		});
	}

	addTimeEntry(participant) {
		this.router.navigate(["../../../../times/timeEntry/add"], {
			state:
				{ participant: participant }
		});
	}

	// applyFilter(filterValue: string) {
	// 	this.dataSource.filter = filterValue.trim().toLowerCase();
	// }

	ngOnInit() {

		// const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		// this.subscriptions.push(sortSubscription);

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadParticipantsList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(1500), // reduce server requests by setting a max of request every 150ms
			distinctUntilChanged(), // eliminate dupe values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadParticipantsList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);
		this.subheaderService.setTitle('Client Records');

		this.dataSource = new ParticipantDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.participantsResult = res;
			if (this.participantsResult.length === 0) {
				this.participanthasItems = false;
			} else {
				this.participanthasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadParticipantsList();
		});

		// this.dataSource.sort = this.sort;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
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
		this.store.dispatch(new ParticipantsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.name = searchText;
		return filter;
	}

	// deleteParticipant(_item: Participant) {
	// 	const _title: string = 'Participant Delete';
	// 	const _description: string = 'Are you sure you want to permanently delete this participant?';
	// 	const _waitDescription: string = 'Participant is deleting..';
	// 	const _deleteMessage: string = 'Participant has been deleted';

	// 	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDescription);
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}

	// 		this.store.dispatch(new ParticipantDeleted({ id: _item.id }));
	// 		this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
	// 	});
	// }

	editParticipant(id) {
		this.router.navigate(['../participants/edit', id], { relativeTo: this.activatedRoute });
	}

	viewParticipant(id) {
		this.router.navigate(['../participants/profile', id], { relativeTo: this.activatedRoute });
	}

	/**
	 * Show add note dialog
	 */
	addNote(value) {
		const saveMessage = 'Note saved';
		const messageType = MessageType.Create;
		const dialogRef = this.dialog.open(UserNoteAddDialogComponent, {
			width: '900px',
			data: { patientId: value.id } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadParticipantsList();
		});
	}
}

// @Component({
// 	selector: 'kt-participant-record-view',
// 	templateUrl: './appointment/participant-record-view-appt-dialog.component.html',
// 	providers: [
// 		{ provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
// 		{
// 			provide: DateAdapter,
// 			useClass: MomentDateAdapter,
// 			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
// 		},
// 		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
// 	]
// })

// export class AppointmentDialogComponent {

// 	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
// 	constructor(
// 		public dialogRef: MatDialogRef<AppointmentDialogComponent>,
// 		@Inject(MAT_DIALOG_DATA) public data: any) { }

// 	onNoClick(): void {
// 		this.dialogRef.close();
// 	}
// }

