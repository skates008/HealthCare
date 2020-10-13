import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentTimegridComponent } from './appointment-timegrid.component';

describe('AppointmentTimegridComponent', () => {
  let component: AppointmentTimegridComponent;
  let fixture: ComponentFixture<AppointmentTimegridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentTimegridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentTimegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
