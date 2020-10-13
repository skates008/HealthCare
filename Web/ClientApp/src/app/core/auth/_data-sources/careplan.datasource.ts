import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import {
	selectCareplansPageLoading,
	selectCareplansShowInitWaitingMessage,
	selectCareplansInStore
} from '../_selectors/careplan.selectors';

export class CareplanDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCareplansPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCareplansShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectCareplansInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
