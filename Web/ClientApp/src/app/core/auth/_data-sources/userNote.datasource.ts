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
	selectUserNoteInStore,
	selectUserNotePageLoading,
	selectUserNoteShowInitWaitingMessage
} from '../_selectors/userNote.selectors';

export class UserNoteDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectUserNotePageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectUserNoteShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectUserNoteInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}
}
