import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantProfileViewComponent } from './participant-profile-view.component';

describe('ParticipantProfileViewComponent', () => {
  let component: ParticipantProfileViewComponent;
  let fixture: ComponentFixture<ParticipantProfileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantProfileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
