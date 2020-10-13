import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import { 
	selectTasksPageLoading, 
	selectTasksShowInitWaitingMessage, 
	selectTasksInStore 
} from '../_selectors/task.selectors';

export class TaskDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectTasksPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectTasksShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectTasksInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
