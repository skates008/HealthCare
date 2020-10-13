import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplansListComponent } from './careplans-list.component';

describe('CareplansViewComponent', () => {
  let component: CareplansListComponent;
  let fixture: ComponentFixture<CareplansListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareplansListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
