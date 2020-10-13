import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesEditComponent } from './therapistPlans-edit.component';

describe('InvoicesEditComponent', () => {
  let component: InvoicesEditComponent;
  let fixture: ComponentFixture<InvoicesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
