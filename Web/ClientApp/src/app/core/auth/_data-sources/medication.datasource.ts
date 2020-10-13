// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../../core/reducers';
// Selectors
import { selectMedicationByParticipantId } from '../_selectors/medication.selectors';

export class MedicationDataSource extends BaseDataSource {
    constructor(private store: Store<AppState>) {
        super();

        this.store.pipe(
            select(selectMedicationByParticipantId)
        ).subscribe((response) => {
            this.paginatorTotalSubject.next(response.total);
            this.entitySubject.next(response.data);
        });
    }
}
