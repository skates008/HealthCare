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
	selectAgreementInStore,
	selectAgreementPageLoading,
	selectAgreementShowInitWaitingMessage
} from '../_selectors/agreement.selectors';

export class AgreementDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectAgreementPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectAgreementShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectAgreementInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}
}
