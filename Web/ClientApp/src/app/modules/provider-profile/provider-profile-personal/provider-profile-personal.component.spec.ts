import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderProfilePersonalComponent } from './provider-profile-personal.component';

describe('ProviderProfilePersonalComponent', () => {
  let component: ProviderProfilePersonalComponent;
  let fixture: ComponentFixture<ProviderProfilePersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderProfilePersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderProfilePersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
