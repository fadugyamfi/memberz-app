import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceNonContributingMembersComponent } from './finance-non-contributing-members.component';

describe('FinanceNonContributingMembersComponent', () => {
  let component: FinanceNonContributingMembersComponent;
  let fixture: ComponentFixture<FinanceNonContributingMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceNonContributingMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceNonContributingMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
