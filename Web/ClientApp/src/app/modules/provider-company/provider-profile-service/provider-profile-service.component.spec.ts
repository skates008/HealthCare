import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderProfileServiceComponent } from './provider-profile-service.component';


describe('ProviderProfileServiceComponent', () => {
  let component: ProviderProfileServiceComponent;
  let fixture: ComponentFixture<ProviderProfileServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderProfileServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderProfileServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
