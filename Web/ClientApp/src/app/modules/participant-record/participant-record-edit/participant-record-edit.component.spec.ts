import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantRecordEditComponent } from './participant-record-edit.component';

describe('ParticipantRecordEditComponent', () => {
	let component: ParticipantRecordEditComponent;
	let fixture: ComponentFixture<ParticipantRecordEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ParticipantRecordEditComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ParticipantRecordEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});