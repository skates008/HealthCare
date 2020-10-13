import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeProviderStepsComponent } from './welcomeProvider.component';

describe('WelcomeProviderStepsComponent', () => {
  let component: WelcomeProviderStepsComponent;
  let fixture: ComponentFixture<WelcomeProviderStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeProviderStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeProviderStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
