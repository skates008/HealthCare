import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePictureDialogComponent } from './provider-profile-picture.component';


describe('ProviderProfilePersonalComponent', () => {
  let component: ProfilePictureDialogComponent;
  let fixture: ComponentFixture<ProfilePictureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePictureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePictureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
