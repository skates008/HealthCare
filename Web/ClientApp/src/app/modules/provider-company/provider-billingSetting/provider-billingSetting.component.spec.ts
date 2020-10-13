import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderbillingSettingComponent } from './provider-billingSetting.component';


describe('ProviderbillingSettingComponent', () => {
  let component: ProviderbillingSettingComponent;
  let fixture: ComponentFixture<ProviderbillingSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderbillingSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderbillingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
