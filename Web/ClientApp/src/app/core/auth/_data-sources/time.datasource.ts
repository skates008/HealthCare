import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import {
	selectTimesPageLoading,
	selectTimesShowInitWaitingMessage,
	selectTimesInStore
} from '../_selectors/time.selectors';

export class TimeDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectTimesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectTimesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectTimesInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
