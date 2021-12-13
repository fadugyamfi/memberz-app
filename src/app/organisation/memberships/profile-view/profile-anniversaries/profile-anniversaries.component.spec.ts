import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAnniversariesComponent } from './profile-anniversaries.component';

describe('ProfileAnniversariesComponent', () => {
  let component: ProfileAnniversariesComponent;
  let fixture: ComponentFixture<ProfileAnniversariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileAnniversariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAnniversariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
