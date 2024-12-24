import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileGroupsComponent } from './profile-groups.component';

describe('ProfileGroupsComponent', () => {
  let component: ProfileGroupsComponent;
  let fixture: ComponentFixture<ProfileGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProfileGroupsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
