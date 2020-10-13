import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplansEditComponent } from './careplans-edit.component';

describe('CareplansEditComponent', () => {
  let component: CareplansEditComponent;
  let fixture: ComponentFixture<CareplansEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareplansEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplansEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
