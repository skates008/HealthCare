import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantProfileEditComponent } from './participant-profile-edit.component';

describe('ParticipantProfileEditComponent', () => {
  let component: ParticipantProfileEditComponent;
  let fixture: ComponentFixture<ParticipantProfileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
