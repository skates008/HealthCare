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
import {  selectTimesActionLoading, selectTimeById, StatementViewPageRequested,StatementViewPageLoaded, selectTimesInStore } from "./../../../core/auth";

// Layout config

//Angular Material
import { MatDialog } from "@angular/material";
import { AppState } from './../../../core/reducers';
import { LayoutConfigService, SubheaderService } from './../../../core/_base/layout';

@Component({
  selector: 'kt-statement-view',
  templateUrl: './statement-view.component.html',
  styleUrls: ['./statement-view.component.scss']
})
export class StatementViewComponent implements OnInit {

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

	time: any;
	loading$: any;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	billableItemsList: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private subheaderService: SubheaderService,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog
  ) { }

	ngOnInit() {
		this.initStatement()
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				const id = params["id"];
				if (id ) {
					this.store.dispatch(new StatementViewPageRequested({StatementId : id}));
					this.store.pipe(select(selectTimesInStore)).subscribe(res =>{ 
						this.time = res.data[0];
						if (res){
							this.time = res.data[0];
							this.billableItemsList = this.time.billableItems;
						}
					});
				}
			}
		);
	}


	initStatement() {
		this.subheaderService.setTitle('Statement');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Statement Details' }
		]);
	}


}
