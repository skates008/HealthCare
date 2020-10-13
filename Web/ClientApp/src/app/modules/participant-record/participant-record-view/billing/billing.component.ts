import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// NGRX
import { Store, select } from "@ngrx/store";
import { AppState } from "./../../../../../app/core/reducers";

import { AppointmentsPageRequested, selectQueryResultAppointment, Appointment } from "./../../../../../app/core/auth";
import { closestTo, isPast, isFuture } from 'date-fns';

import { QueryParamsModel } from './../../../../core/_base/crud';
import { ActivatedRoute, Router } from "@angular/router";
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
	selector: 'kt-billing',
	templateUrl: './billing.component.html',
	styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
	participantId: number;
	private subscriptions: Subscription[] = [];
	selection = new SelectionModel<Appointment>(true, []);

	constructor(
		private store: Store<AppState>,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			params => {
				this.participantId = params["id"];
			}
		);

	}
}
