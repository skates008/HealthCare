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
	selectAssessmentInStore,
	selectAssessmentPageLoading,
	selectAssessmentShowInitWaitingMessage
} from '../_selectors/assessment.selectors';

export class AssessmentDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectAssessmentPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectAssessmentShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectAssessmentInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}
}
