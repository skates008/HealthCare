import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsDialogCheckinComponent } from './events-dialog-checkin.component';

describe('EventsDialogCheckinComponent', () => {
  let component: EventsDialogCheckinComponent;
  let fixture: ComponentFixture<EventsDialogCheckinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsDialogCheckinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsDialogCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
