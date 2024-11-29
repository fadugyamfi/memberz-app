import { Component, OnDestroy, OnInit } from '@angular/core';
import { FinanceTrendComponent } from '../../../shared/components/charts/finance-trend/finance-trend.component';
import { FinanceTotalsByCategoryComponent } from '../../../shared/components/charts/finance-totals-by-category/finance-totals-by-category.component';
import { FinanceWeeklyBreakdownComponent } from '../../../shared/components/charts/finance-weekly-breakdown/finance-weekly-breakdown.component';
import { FinanceCategoryBreakdownComponent } from '../../../shared/components/charts/finance-category-breakdown/finance-category-breakdown.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [FinanceTrendComponent, FinanceTotalsByCategoryComponent, FinanceWeeklyBreakdownComponent, FinanceCategoryBreakdownComponent]
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(
    
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }
}
