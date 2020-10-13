import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';

import {
	selectInvoicesPageLoading,
	selectInvoicesShowInitWaitingMessage,
	selectInvoicesInStore
} from '../_selectors/invoice.selectors';

export class InvoiceDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectInvoicesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectInvoicesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectInvoicesInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
