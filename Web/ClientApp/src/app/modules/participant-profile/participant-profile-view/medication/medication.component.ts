import { Component, OnInit } from '@angular/core';
import { Medication } from '.././../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AppState } from '.././../../../core/reducers';
import { MedicationOnServerCreated, selectLastCreatedMedicationId } from '.././../../../core/auth';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';


@Component({
  selector: 'kt-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.scss']
})
export class MedicationComponent implements OnInit {

  medication: Medication;
  private subscriptions: Subscription[] = [];
  form: any[] = ['Solid', 'Liquid', 'Capsule'];
  loading$: any;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<MedicationComponent>,
  ) { }

  ngOnInit() {
    this.medication = new Medication;
    this.medication.form = null;
    this.medication.frequency = null;
  }

  submit() {
    const preparedMedication = this.preparedMedication();
    this.addMedication(preparedMedication);
  }

  preparedMedication(): Medication {
    const _medication = new Medication();
    _medication.clear();
    _medication.manufacturer = this.medication.manufacturer;
    _medication.medicine = this.medication.medicine;
    _medication.formOfMedicine = Number(this.medication.form);
      _medication.amount = this.medication.amount;
    _medication.frequency = Number(this.medication.frequency);
    _medication.expirationDate = this.medication.expirationDate;
    return _medication;
  }
  addMedication(_medication) {
    this.store.dispatch(new MedicationOnServerCreated({ medication: _medication }));
    const addSubscription = this.store.pipe(select(selectLastCreatedMedicationId)).subscribe(newId => {
      if (!newId) {
        return;
      }
      this.dialogRef.close({
        isMedicationadded: true
      });
    });
    this.subscriptions.push(addSubscription);
  }
}
