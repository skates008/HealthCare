// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../reducers';
import {
	selectAppointmentTypeInStore,
	selectAppointmentTypePageLoading,
	selectAppointmentTypeShowInitWaitingMessage
} from '../_selectors/appointment-type.selectors';

export class AppointmentTypeDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectAppointmentTypePageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectAppointmentTypeShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectAppointmentTypeInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}
}
