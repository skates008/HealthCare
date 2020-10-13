import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import { selectCompanysPageLoading, selectCompanysShowInitWaitingMessage, selectCompanysInStore } from '../_selectors/company.selectors';

export class CompanyDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCompanysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCompanysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectCompanysInStore)
		).subscribe((response) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
