import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderEventsComponent } from './events.component';

describe('EventsComponent', () => {
  let component: ProviderEventsComponent;
  let fixture: ComponentFixture<ProviderEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
