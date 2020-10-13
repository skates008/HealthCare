import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementsListComponent } from './statements-list.component';

describe('StatementsViewComponent', () => {
  let component: StatementsListComponent;
  let fixture: ComponentFixture<StatementsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
