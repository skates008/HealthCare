import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderProfilePasswordComponent } from './provider-profile-password.component';


describe('ProviderProfilePasswordComponent', () => {
  let component: ProviderProfilePasswordComponent;
  let fixture: ComponentFixture<ProviderProfilePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderProfilePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderProfilePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
