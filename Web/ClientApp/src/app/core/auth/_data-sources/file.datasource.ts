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
	selectFileInStore,
	selectFilePageLoading,
	selectFileShowInitWaitingMessage
} from '../_selectors/file.selectors';

export class FileDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectFilePageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectFileShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectFileInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}
}
