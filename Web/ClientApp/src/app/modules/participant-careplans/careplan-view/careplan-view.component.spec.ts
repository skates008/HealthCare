import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplanViewComponent } from './careplan-view.component';

describe('CareplanViewComponent', () => {
  let component: CareplanViewComponent;
  let fixture: ComponentFixture<CareplanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareplanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
