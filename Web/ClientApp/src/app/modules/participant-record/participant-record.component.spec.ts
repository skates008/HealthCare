import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantRecordComponent } from './participant-record.component';

describe('ParticipantRecordComponent', () => {
  let component: ParticipantRecordComponent;
  let fixture: ComponentFixture<ParticipantRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantRecordComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
