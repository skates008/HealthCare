import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantSettingsComponent } from './participant-settings.component';

describe('ParticipantSettingsComponent', () => {
  let component: ParticipantSettingsComponent;
  let fixture: ComponentFixture<ParticipantSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
