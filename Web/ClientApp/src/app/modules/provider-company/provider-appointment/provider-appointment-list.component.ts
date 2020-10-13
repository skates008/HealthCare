import { AfterViewInit, AfterViewChecked, Input } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
// RXJS
import { distinctUntilChanged, skip, take, delay } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../core/_base/crud';

// Models
import {
	AppointmentType,
	AppointmentTypeDataSource,
	AppointmentTypeDeleted,
	AppointmentTypePageRequested,
	selectAppointmentTypeInStore
} from '../../../core/auth';
import { SubheaderService } from '../../../core/_base/layout';
import { ProviderAppointmentEditDialogComponent } from './provider-appointment-edit/provider-appointment-edit.dialog.component';
import { ProviderAppointmentAddDialogComponent } from './provider-appointment-add/provider-appointment-add.dialog.component';

@Component({
	selector: 'kt-provider-appointment-list',
	styleUrls: ['./provider-appointment-list.component.scss'],
	templateUrl: './provider-appointment-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProviderAppointmentListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: AppointmentTypeDataSource;
	displayedColumns = ['name', 'isBillable', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	lastQuery: QueryParamsModel;
	appointmentsResult;
	appointmentshasItems = false;

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
		this.dataSource = new AppointmentTypeDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.appointmentsResult = res;
			if (this.appointmentsResult.length === 0) {
				this.appointmentshasItems = false;
			} else {
				this.appointmentshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadAppointmentTypesList();
		});
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load appointments list
	 */
	loadAppointmentTypesList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration()
		);

		this.store.dispatch(new AppointmentTypePageRequested({
			page: queryParams
		}));
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete appointment
	 *
	 * @param _item: AppointmentType
	 */
	deleteAppointmentType(item: AppointmentType) {
		const title = 'Appointment type Delete';
		const description = 'Are you sure to permanently delete this appointment?';
		const waitDesciption = 'Appointment type is deleting...';
		const deleteMessage = `Appointment type has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new AppointmentTypeDeleted({ appointmentType: item }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			setTimeout(() => {
				this.loadAppointmentTypesList();
			}, 500);
		});
	}

	/**
	 * Show add note dialog
	 */
	addAppointmentType() {
		const saveMessage = 'Appointment Type saved';
		const messageType = MessageType.Create;
		const dialogRef = this.dialog.open(ProviderAppointmentAddDialogComponent, {
			width: '600px',
			data: {} });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadAppointmentTypesList();
		});
	}

	/**
	 * @param appointment: AppointmentTypes
	 */
	editAppointmentType(appointment) {
		const saveMessage = 'Appointment Type updated';
		const messageType = MessageType.Update;
		const dialogRef = this.dialog.open(ProviderAppointmentEditDialogComponent, {
			width: '600px',
			data: { appointment } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadAppointmentTypesList();
		});
	}
}
