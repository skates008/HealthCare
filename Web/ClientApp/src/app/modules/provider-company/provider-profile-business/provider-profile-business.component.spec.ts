import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderProfileBusinessComponent } from './provider-profile-business.component';

describe('ProviderProfileBusinessComponent', () => {
  let component: ProviderProfileBusinessComponent;
  let fixture: ComponentFixture<ProviderProfileBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderProfileBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderProfileBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
