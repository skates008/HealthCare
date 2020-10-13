import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringAppointmentsDialogComponent } from './recurring-appointments-dialog.component';

describe('RecurringAppointmentsDialogComponent', () => {
  let component: RecurringAppointmentsDialogComponent;
  let fixture: ComponentFixture<RecurringAppointmentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringAppointmentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringAppointmentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
