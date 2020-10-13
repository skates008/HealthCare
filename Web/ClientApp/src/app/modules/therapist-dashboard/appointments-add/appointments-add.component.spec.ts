import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsAddComponent } from './appointments-add.component';

describe('AppointmentsAddComponent', () => {
  let component: AppointmentsAddComponent;
  let fixture: ComponentFixture<AppointmentsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
