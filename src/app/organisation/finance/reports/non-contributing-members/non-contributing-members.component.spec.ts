import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonContributingMembersComponent } from './non-contributing-members.component';

describe('NonContributingMembersComponent', () => {
  let component: NonContributingMembersComponent;
  let fixture: ComponentFixture<NonContributingMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NonContributingMembersComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonContributingMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
