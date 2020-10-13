import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import {
	selectProfilesPageLoading,
	selectProfilesShowInitWaitingMessage,
	selectProfilesInStore
} from '../_selectors/profile.selectors';

export class ProfileDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectProfilesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectProfilesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectProfilesInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
