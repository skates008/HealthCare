import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import { 
	selectTeamsPageLoading, 
	selectTeamsShowInitWaitingMessage, 
	selectTeamsInStore 
} from '../_selectors/team.selectors';

export class TeamDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectTeamsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectTeamsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectTeamsInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
