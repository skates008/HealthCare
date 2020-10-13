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
import {  selectTasksActionLoading, selectTaskById } from './../../../core/auth';

// Layout config

//Angular Material
import { MatDialog } from '@angular/material';
import { AppState } from './../../../core/reducers';
import { LayoutConfigService } from './../../../core/_base/layout';
import { Location } from '@angular/common';

@Component({
  selector: 'kt-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

	@Input() data: { labels: string[]; datasets: any[] };
	@Input() type: string = 'line';
	@ViewChild('chart', { static: true }) chart: ElementRef;
	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param layoutConfigService
	 */
	task: any;
	loading$: any;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	  
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _location: Location,
		private store: Store<AppState>,
		private layoutConfigService: LayoutConfigService,
		private dialog: MatDialog
  ) { }

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				const id = params['id'];
				if (id) {
					this.store
						.pipe(select(selectTaskById(id)))
						.subscribe(res => {
							if (res) {
								this.task = res;
							}
						});
				}
			}
		);
	}

	edit(id) {
		this.router.navigate(['../../tasks/edit', id], {
			relativeTo: this.activatedRoute
		});
	}


	getHistory(id) { }

	viewParticipant(id) {
		this.router.navigate(['../../../participant-record/participants/profile', id], { relativeTo: this.activatedRoute });
	}

	back() {
		this._location.back();
	}
}
