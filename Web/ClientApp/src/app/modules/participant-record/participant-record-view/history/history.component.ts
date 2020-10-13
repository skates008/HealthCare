import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// NGRX
import { Store, select } from "@ngrx/store";
import { AppState } from "./../../../../../app/core/reducers";

import { AppointmentsPageRequested, selectQueryResultAppointment, Appointment } from "./../../../../../app/core/auth";
import { closestTo, isPast, isFuture } from 'date-fns';

import { QueryParamsModel } from '.././../../../core/_base/crud';
import { ActivatedRoute, Router } from "@angular/router";
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';



@Component({
  selector: 'kt-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  allAppointments: any;
  historyAppointments: any;
  participantId: number;
  displayedColumns = ['date', 'practitioner', 'type', 'time', 'note'];
  @ViewChild('sort1', { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
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

        if (this.participantId && this.participantId > 0) {
          this.loadAppointmentHistory(this.participantId);

        }
      }
    );
    // Filtration, bind to searchInput
    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      // tslint:disable-next-line:max-line-length
      debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
      distinctUntilChanged(), // This operator will eliminate duplicate values
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadAppointmentHistory(this.participantId);
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);


  }

  loadAppointmentHistory(id) {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
		this.store.dispatch(new AppointmentsPageRequested({ page: queryParams,appointmentParams: ""}));
    this.store.pipe(select(selectQueryResultAppointment)).subscribe(res => {
      this.allAppointments = res.data;
      const appointmentHistoryArray = [];
      this.allAppointments.map(res => {
        if (isPast(new Date(res.date)) && res.participant.id == id) {
          appointmentHistoryArray.push(res);
        }
      })
      this.historyAppointments = appointmentHistoryArray;
    })
    this.selection.clear();

  }

  filterConfiguration() {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    filter.name = searchText;
    return filter;
  }

}
