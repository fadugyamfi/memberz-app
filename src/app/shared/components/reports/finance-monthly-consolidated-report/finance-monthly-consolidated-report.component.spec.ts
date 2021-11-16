import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceMonthlyConsolidatedReportComponent } from './finance-monthly-consolidated-report.component';

describe('FinanceMonthlyConsolidatedReportComponent', () => {
  let component: FinanceMonthlyConsolidatedReportComponent;
  let fixture: ComponentFixture<FinanceMonthlyConsolidatedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceMonthlyConsolidatedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceMonthlyConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
