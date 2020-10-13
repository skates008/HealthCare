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
import { selectTeamsActionLoading, selectTeamById } from "./../../../core/auth";

// Layout config

//Angular Material
import { MatDialog } from "@angular/material";
import { AppState } from './../../../core/reducers';
import { LayoutConfigService } from './../../../core/_base/layout';

@Component({
	selector: 'kt-team-view',
	templateUrl: './teams-view.component.html',
	styleUrls: ['./teams-view.component.scss']
})
export class TeamViewComponent implements OnInit {

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
	team: any;
	loading$: any;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog
	) { }


	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				const id = params["id"];
				if (id) {
					this.store
						.pipe(select(selectTeamById(id)))
						.subscribe(res => {
							if (res) {
								this.team = res;
							}
						});
				}
			}

		);
	}

	edit(id) {
		this.router.navigate(["../../teams/edit", id], {
			relativeTo: this.activatedRoute
		});
	}


	getHistory(id) { }

	viewParticipant(id) {
		this.router.navigate(['../../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}
}
