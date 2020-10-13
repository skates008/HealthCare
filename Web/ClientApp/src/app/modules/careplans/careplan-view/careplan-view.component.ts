import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	Input,
	Inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// NGRX
import { Store, select } from '@ngrx/store';

// Layout config

// Angular Material
import { MatDialog } from '@angular/material';
import { AppState } from '../../../core/reducers';
import { SubheaderService, LayoutConfigService } from '../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import {
	GenerateSummaryPlan,
	getCareplanDetails,
	selectCareplansInStore} from '../../../../app/core/auth';
import { QueryParamsModel } from '../../../core/_base/crud';
import { Location } from '@angular/common';


@Component({
	selector: 'kt-careplan-view',
	templateUrl: './careplan-view.component.html',
	styleUrls: ['./careplan-view.component.scss']
})
export class CareplanViewComponent implements OnInit {

	@Input() data: { labels: string[]; datasets: any[] };
	@Input() type: string = 'line';
	@ViewChild('chart', { static: true }) chart: ElementRef;
	panelOpenState = false;
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param layoutConfigService
	 */

	careplan: any;
	noteList: any;
	queryParams: any;
	participantId: number;
	loading$: any;
	viewLoading = false;
  	loadingAfterSubmit = false;
	selectedTab = 0;
	careplanDetails: any;
	observationList: any;
	assessmentList: any;
	treatmentNotes: any;
	familyGoalsList: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private _location: Location,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog,
		private subheaderService: SubheaderService
	) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state.Careplan) {
			this.careplanDetails = this.router.getCurrentNavigation().extras.state.Careplan;
			this.loadPage();
		} else {
			this.router.navigate(['../../../careplans/careplans'], { relativeTo: this.activatedRoute });
		}

		// dialog.afterAllClosed.subscribe(() => {
		// 	// update a variable or call a function when the dialog closes
		// 	this.loadPage();
		// 	}
		// );
	}

	ngOnInit() {
		this.loadPage();
		this.subheaderService.setTitle('Care Plan');

	}

	loadPage() {
		this.store.dispatch(new getCareplanDetails({Careplan:  this.careplanDetails }));
		this.store.pipe(select(selectCareplansInStore)).subscribe(res => {
			if (res.data) {
				this.careplan = res.data[0];
				if (this.careplan) {
						this.familyGoalsList = this.careplan.familyGoals;
						this.observationList = this.careplan.observations;
						this.assessmentList = this.careplan.assessments;
						this.treatmentNotes = this.careplan.treatmentNotes;
				}
			}
		});
		this.queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
	}

	edit(careplan) {
		this.router.navigate(['../../careplans/edit',careplan.id], {
			relativeTo: this.activatedRoute,
			state:{
				careplan : careplan
			}
		});
	}

	goToTss(id) {
		this.router.navigate(['../../../therapistPlans/therapistPlan-details', id], { relativeTo: this.activatedRoute });
	}

	downloadTss(careplan) {
		this.store.dispatch(new GenerateSummaryPlan({Careplan: careplan }));
	}

	viewParticipant(id) {
		this.router.navigate(['../../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	back() {
		this._location.back();
	}
}
