import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFamilyComponent } from './profile-family.component';

describe('ProfileFamilyComponent', () => {
  let component: ProfileFamilyComponent;
  let fixture: ComponentFixture<ProfileFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileFamilyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
