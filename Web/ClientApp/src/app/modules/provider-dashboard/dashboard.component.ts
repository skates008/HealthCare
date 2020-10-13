// Angular
import {
	Component, OnInit,
	ViewChild,
	TemplateRef
} from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { SubheaderService, LayoutConfigService, SparklineChartOptions } from './../../core/_base/layout';
import { Widget4Data } from './../../layout/partials/content/widgets/widget4/widget4.component';
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { LayoutUtilsService, MessageType, QueryParamsModel } from './../../core/_base/crud';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../core/reducers';
import { NotificationPageRequested, selectNotificationByParticipantId } from './../../core/auth';


const colors: any = {
	red: {
		primary: '#ad2121',
		secondary: '#FAE3E3'
	},
	blue: {
		primary: '#1e90ff',
		secondary: '#D1E8FF'
	},
	yellow: {
		primary: '#e3bc08',
		secondary: '#FDF1BA'
	}
};

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

	@ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
	@ViewChild('pickerStart', { static: true }) datePickerStart: MatDatepicker<Date>;
	@ViewChild('pickerEnd', { static: true }) datePickerEnd: MatDatepicker<Date>;

	viewDate: Date = new Date();
	modalData: {
		action: string;
		event;
	};

	events: [] = [];
	bookedAppointments: any;
	eventObj: Object;
	refresh: Subject<any> = new Subject();
	activeDayIsOpen: boolean = false;
	_updateMessage: string;

	constructor(
		private layoutConfigService: LayoutConfigService,
		private modal: NgbModal, private dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>, private router: Router,
		private activatedRoute: ActivatedRoute,
		private subheaderService: SubheaderService,
	) {

	}

	ngOnInit(): void {
		this.subheaderService.setTitle('Dashboard');
	}

	loadNotificatoins() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.store.dispatch(new NotificationPageRequested({ page: queryParams }));
	}

	onAddTask() {
		this.router.navigate(['../tasks/tasks/add'], { relativeTo: this.activatedRoute });
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

}
