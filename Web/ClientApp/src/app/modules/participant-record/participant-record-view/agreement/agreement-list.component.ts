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
import { AppState } from '../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
// Models
import {
	Agreement,
	AgreementDataSource,
	AgreementDeleted,
	AgreementPageRequested,
	selectAgreementInStore
} from '../../../../core/auth';
import { SubheaderService } from '../../../../core/_base/layout';
import { AgreementEditDialogComponent } from './agreement-edit/agreement-edit.dialog.component';
import { AgreementAddDialogComponent } from './agreement-add/agreement-add.dialog.component';

@Component({
	selector: 'kt-agreement-list',
	styleUrls: ['./agreement-list.component.scss'],
	templateUrl: './agreement-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class AgreementListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: AgreementDataSource;
	displayedColumns = ['title', 'signedDate', 'validFromDate', 'validToDate', 'note', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@Input() participantId: string;
	// Filter fields
	lastQuery: QueryParamsModel;
	agreementsResult;
	agreementshasItems = false;

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
		this.dataSource = new AgreementDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.agreementsResult = res;
			if (this.agreementsResult.length === 0) {
				this.agreementshasItems = false;
			} else {
				this.agreementshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadAgreementsList();
		});
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load agreements list
	 */
	loadAgreementsList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration()
		);

		this.store.dispatch(new AgreementPageRequested({
			participantId: this.participantId,
			page: queryParams
		}));

		this.store.pipe(select(selectAgreementInStore)).subscribe(res => {
			if (res.total === 0) {
				this.agreementshasItems = false;
				return;
			} else {
				this.agreementshasItems = true;
				this.agreementsResult = res;
			}
		});
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete agreement
	 *
	 * @param _item: Agreement
	 */
	deleteAgreement(item: Agreement) {
		const title = 'Agreement Delete';
		const description = 'Are you sure to permanently delete this agreement?';
		const waitDesciption = 'Agreement is deleting...';
		const deleteMessage = `Agreement has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new AgreementDeleted({ agreement: item }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			this.loadAgreementsList();
		});
	}

	/**
	 * Show add note dialog
	 */
	addAgreement() {
		const saveMessage = 'Agreement saved';
		const messageType = MessageType.Create;
		const dialogRef = this.dialog.open(AgreementAddDialogComponent, {
			width: '900px',
			data: { patientId: this.participantId } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadAgreementsList();
		});
	}

	/**
	 * @param agreement: Agreements
	 */
	editAgreement(agreement) {
		const saveMessage = 'Agreement saved';
		const messageType = MessageType.Update;
		const dialogRef = this.dialog.open(AgreementEditDialogComponent, {
			data: { agreement } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadAgreementsList();
		});
	}
}
