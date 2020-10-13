import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	Input,
	Inject
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

// NGRX
import { Store, select } from "@ngrx/store";
import {  selectCareplansActionLoading, selectCareplanById, getCareplanDetails, selectCareplansInStore } from "./../../../core/auth";

// Layout config

//Angular Material
import { MatDialog } from "@angular/material";
import { AppState } from './../../../core/reducers';
import { LayoutConfigService } from './../../../core/_base/layout';

@Component({
  selector: 'kt-careplan-view',
  templateUrl: './careplan-view.component.html',
  styleUrls: ['./careplan-view.component.scss']
})
export class CareplanViewComponent implements OnInit {

	@Input() data: { labels: string[]; datasets: any[] };
	@Input() type: string = "line";
	@ViewChild("chart", { static: true }) chart: ElementRef;
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param layoutConfigService
	 */

	bussiness = [{ id: 1, name: 'Business 1' }, { id: 2, name: 'Business 2' }, { id: 3, name: 'Business 3' }];
	participants = [{id: 1234, name: 'Dave Newman'},{id: 1235, name: 'Sohal Rana'},{id: 1236, name: 'Gustavo Sessa'}];
	careplan: any;
	loading$: any;
	viewLoading: boolean = false;
	careplanDetails: any;
	familyGoalsList: any;	
	observationList: any;
	assessmentList: any;
	treatmentNotes: any;
	selectedTab: number = 0;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog
  ) {
	if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state.Careplan) {
		this.careplanDetails = this.router.getCurrentNavigation().extras.state.Careplan;
	}
	else{
		//navigate to list page
		this.router.navigate(['../../../careplans/careplans'], { relativeTo: this.activatedRoute });

	}
   }
  

	ngOnInit() {
		this.store.dispatch(new getCareplanDetails({Careplan:  this.careplanDetails }));	
		this.store.pipe(select(selectCareplansInStore)).subscribe(res => {
				this.careplan = res.data[0];
				if(this.careplan){
						this.familyGoalsList = this.careplan.familyGoals;
						this.observationList = this.careplan.observations;
						this.assessmentList = this.careplan.assessments;
						this.treatmentNotes = this.careplan.treatmentNotes;
				}
		})
	}

	edit(id) {
		this.router.navigate(["../../careplans/edit", id], {
			relativeTo: this.activatedRoute
		});
	}

	getParticipantStr(id: number): string {
		let _name: string = '';
		this.participants.forEach(function (v) {
			if (v.id === id) {
				_name = v.name
			}
		});
		return _name;
	}

	getHistory(id) { }

	viewParticipant(id) {
		this.router.navigate(['../../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
