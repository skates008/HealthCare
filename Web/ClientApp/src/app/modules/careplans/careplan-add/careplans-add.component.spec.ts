import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplansAddComponent } from './careplans-add.component';

describe('CareplansAddComponent', () => {
  let component: CareplansAddComponent;
  let fixture: ComponentFixture<CareplansAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareplansAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplansAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
