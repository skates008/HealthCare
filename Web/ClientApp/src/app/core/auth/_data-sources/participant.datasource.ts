import { Store, select } from '@ngrx/store';

import { BaseDataSource, QueryResultsModel } from '../../_base/crud';

import { AppState } from '../../reducers';
import {
	selectParticipantsPageLoading,
	selectParticipantsShowInitWaitingMessage,
	selectParticipantsInStore
} from '../_selectors/participant.selectors';

export class ParticipantDataSource extends BaseDataSource {

	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectParticipantsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectParticipantsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectParticipantsInStore)
		).subscribe((response) => {
			this.paginatorTotalSubject.next(response.total);
			this.entitySubject.next(response.data);
		});
	}

}
