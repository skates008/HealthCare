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
import {  selectTherapyServicesActionLoading, selectTherapyServiceById } from "./../../../core/auth";

// Layout config

//Angular Material
import { MatDialog } from "@angular/material";
import { AppState } from './../../../core/reducers';
import { LayoutConfigService, SubheaderService } from './../../../core/_base/layout';

@Component({
  selector: 'kt-therapistPlan-view',
  templateUrl: './therapistPlan-view.component.html',
  styleUrls: ['./therapistPlan-view.component.scss']
})
export class TherapistServiceViewComponent implements OnInit {

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
	category = [{ id: 1, name: 'General' }, { id: 2, name: 'Therapy Services' }, { id: 3, name: 'Consultation' }];
	participants = [{id: 1234, name: 'Dave Newman'},{id: 1235, name: 'Sohal Rana'},{id: 1236, name: 'Gustavo Sessa'}];
	therapyService: any;
	viewLoading: boolean = false;
  	loadingAfterSubmit: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private subheaderService: SubheaderService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog
  ) { }
  

	ngOnInit() {
		this.initTherapyService()
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				const id = params["id"];
				if (id && id > 0) { 
					this.store
						.pipe(select(selectTherapyServiceById(id)))
						.subscribe(res => {
							if (res) {
								this.therapyService = res;
							}
						});
				}
			}
			
		);
	}

	initTherapyService() {
		this.subheaderService.setTitle('Therapy Service Summary');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Therapy Service Summary Details' }
		]);
	}

	edit(id) {
		this.router.navigate(["../../therapistPlans/edit", id], {
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

	exportPDF(id) {
		
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

	getHistory(id) { }

	viewParticipant(id) {
		this.router.navigate(['../../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
