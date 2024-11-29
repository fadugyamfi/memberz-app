import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipCardModalComponent } from './membership-card-modal.component';

describe('MembershipCardModalComponent', () => {
  let component: MembershipCardModalComponent;
  let fixture: ComponentFixture<MembershipCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MembershipCardModalComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
