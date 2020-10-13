import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEntryAddComponent } from './timeEntry-add.component';

describe('TimeEntryAddComponent', () => {
  let component: TimeEntryAddComponent;
  let fixture: ComponentFixture<TimeEntryAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeEntryAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeEntryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
