import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '.././../../../core/reducers';
import { AllergyOnServerCreated, Allergy, selectLastCreatedAllergyId } from '.././../../../core/auth';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';


@Component({
  selector: 'kt-allergy',
  templateUrl: './allergy.component.html',
  styleUrls: ['./allergy.component.scss']
})
export class AllergyComponent implements OnInit {

  allergy: Allergy;
  private subscriptions: Subscription[] = [];
  loading$: any;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<AllergyComponent>,
  ) { }

  ngOnInit() {
    this.allergy = new Allergy;
    this.allergy.clinicalStatus = null;
    this.allergy.category = null;
    this.allergy.critical = null;
    this.allergy.allergen = "";
  }

  submit() {
    const preparedAllergy = this.preparedAllergy();
    this.addAllergy(preparedAllergy);
  }

  preparedAllergy(): Allergy {
    const _allergy = new Allergy();
    _allergy.clear();
    _allergy.clinicalStatus =Number(this.allergy.clinicalStatus);
    _allergy.category =Number(this.allergy.category);
     _allergy.critical = Number(this.allergy.critical);
    _allergy.allergen = this.allergy.allergen;
    _allergy.lastOccurenceDate = this.allergy.lastOccurenceDate;
    return _allergy;
  }

  addAllergy(_allergy) {
    this.store.dispatch(new AllergyOnServerCreated({ allergy: _allergy }));
    const addSubscription = this.store.pipe(select(selectLastCreatedAllergyId)).subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close({
        isAllergyadded: true
      });
    });
    this.subscriptions.push(addSubscription);
  }

}
