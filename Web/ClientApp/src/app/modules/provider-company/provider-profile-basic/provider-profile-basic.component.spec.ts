import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderProfileBasicComponent } from './provider-profile-basic.component';


describe('ProviderProfileBasicComponent', () => {
  let component: ProviderProfileBasicComponent;
  let fixture: ComponentFixture<ProviderProfileBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderProfileBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderProfileBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
