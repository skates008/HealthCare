import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import { 
	selectBillableItemsPageLoading, 
	selectBillableItemsShowInitWaitingMessage, 
	selectBillableItemsInStore 
} from '../_selectors/billableItem.selectors';

export class BillableItemDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectBillableItemsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectBillableItemsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectBillableItemsInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
