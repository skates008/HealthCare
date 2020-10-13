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
	Assessment,
	AssessmentDataSource,
	AssessmentDeleted,
	AssessmentPageRequested,
	selectAssessmentInStore
} from '../../../../core/auth';
import { SubheaderService } from '../../../../core/_base/layout';
import { AssessmentEditDialogComponent } from './assessment-edit/assessment-edit.dialog.component';
import { AssessmentAddDialogComponent } from './assessment-add/assessment-add.dialog.component';

@Component({
	selector: 'kt-assessment-list',
	styleUrls: ['./assessment-list.component.scss'],
	templateUrl: './assessment-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssessmentListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: AssessmentDataSource;
	displayedColumns = ['createdByName', 'title', 'assessor', 'validToDate', 'validFromDate', 'assessmentDate', 'note', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@Input() participantId: string;
	// Filter fields
	lastQuery: QueryParamsModel;
	assessmentsResult;
	assessmentshasItems = false;

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
		this.dataSource = new AssessmentDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			this.assessmentsResult = res;
			if (this.assessmentsResult.length === 0) {
				this.assessmentshasItems = false;
			} else {
				this.assessmentshasItems = true;
			}
		});
		this.subscriptions.push(entitiesSubscription);

		of(undefined).pipe(take(1), delay(1000)).subscribe(() => {
			this.loadAssessmentsList();
		});
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load assessments list
	 */
	loadAssessmentsList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration()
		);

		this.store.dispatch(new AssessmentPageRequested({
			participantId: this.participantId,
			page: queryParams
		}));

		this.store.pipe(select(selectAssessmentInStore)).subscribe(res => {
			if (res.total === 0) {
				this.assessmentshasItems = false;
				return;
			} else {
				this.assessmentshasItems = true;
				this.assessmentsResult = res;
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
	 * Delete assessment
	 *
	 * @param _item: Assessment
	 */
	deleteAssessment(item: Assessment) {
		const title = 'Assessment Delete';
		const description = 'Are you sure to permanently delete this assessment?';
		const waitDesciption = 'Assessment is deleting...';
		const deleteMessage = `Assessment has been deleted`;

		const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new AssessmentDeleted({ assessment: item }));
			this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
			this.loadAssessmentsList();
		});
	}

	/**
	 * Show add note dialog
	 */
	addAssessment() {
		const saveMessage = 'Assessment saved';
		const messageType = MessageType.Create;
		const dialogRef = this.dialog.open(AssessmentAddDialogComponent, {
			width: '900px',
			data: { patientId: this.participantId } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadAssessmentsList();
		});
	}

	/**
	 * @param assessment: Assessments
	 */
	editAssessment(assessment) {
		const saveMessage = 'Assessment saved';
		const messageType = MessageType.Update;
		const dialogRef = this.dialog.open(AssessmentEditDialogComponent, {
			data: { assessment } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType);
			this.loadAssessmentsList();
		});
	}
}
