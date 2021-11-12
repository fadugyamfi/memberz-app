import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceIncomeSummaryComponent } from './finance-income-summary.component';

describe('FinanceIncomeSummaryComponent', () => {
  let component: FinanceIncomeSummaryComponent;
  let fixture: ComponentFixture<FinanceIncomeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceIncomeSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceIncomeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
