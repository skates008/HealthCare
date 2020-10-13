import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '.././../../../core/reducers';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Budget, BudgetOnServerCreated, selectLastCreatedBudgetId } from '.././../../../core/auth';
@Component({
  selector: 'kt-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {

  budget: Budget;
  private subscriptions: Subscription[] = [];
  loading$: any;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<BudgetComponent>,
  ) { }

  ngOnInit() {
    this.budget = new Budget;
    this.budget.sourceOfBudget = null;
  }

  submit() {
    const preparedBudget = this.preparedBudget();
    this.addBudget(preparedBudget);
  }

  preparedBudget(): Budget {
    const _budget = new Budget();
    _budget.clear();
    _budget.budgetName = this.budget.budgetName;
    _budget.totalBudget = this.budget.totalBudget;
    // _budget.remainingBudget = this.budget.totalBudget;
    _budget.sourceOfBudget = Number(this.budget.sourceOfBudget);
    _budget.startDate = this.budget.startDate;
    _budget.endDate = this.budget.endDate;
    return _budget;
  }
  addBudget(_budget) {
    this.store.dispatch(new BudgetOnServerCreated({ budget: _budget }));
    const addSubscription = this.store.pipe(select(selectLastCreatedBudgetId)).subscribe(newId => {
      if (!newId) {
        return;
      }
      this.dialogRef.close({
        isBudgetadded: true
      });
    });
    this.subscriptions.push(addSubscription);
  }
}
