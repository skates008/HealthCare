import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderProfileAccountComponent } from './provider-profile-account.component';


describe('ProviderProfileAccountComponent', () => {
  let component: ProviderProfileAccountComponent;
  let fixture: ComponentFixture<ProviderProfileAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderProfileAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderProfileAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
