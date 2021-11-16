import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyConsolidatedReportComponent } from './monthly-consolidated-report.component';

describe('MonthlyConsolidatedReportComponent', () => {
  let component: MonthlyConsolidatedReportComponent;
  let fixture: ComponentFixture<MonthlyConsolidatedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyConsolidatedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
