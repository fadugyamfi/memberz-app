import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipOverviewComponent } from './membership-overview.component';

describe('MembershipOverviewComponent', () => {
  let component: MembershipOverviewComponent;
  let fixture: ComponentFixture<MembershipOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
