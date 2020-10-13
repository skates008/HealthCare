import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import { 
	selectTherapyServicesPageLoading, 
	selectTherapyServicesShowInitWaitingMessage, 
	selectTherapyServicesInStore 
} from '../_selectors/therapyService.selectors';

export class TherapyServiceDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectTherapyServicesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectTherapyServicesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectTherapyServicesInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
