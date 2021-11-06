import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceWeeklyBreakdownComponent } from './finance-weekly-breakdown.component';

describe('FinanceWeeklyBreakdownComponent', () => {
  let component: FinanceWeeklyBreakdownComponent;
  let fixture: ComponentFixture<FinanceWeeklyBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceWeeklyBreakdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceWeeklyBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
