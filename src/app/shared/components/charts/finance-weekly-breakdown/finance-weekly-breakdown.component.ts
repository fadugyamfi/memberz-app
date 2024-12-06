import { Component, OnInit } from '@angular/core';
import { FinanceDashboardService } from '../../../services/api/finance-dashboard.service';
import * as chartData from '../../../data/chart/chartjs';
import { SelectYearControlComponent } from '../../forms/select-year-control/select-year-control.component';
import { FormsModule } from '@angular/forms';
import { SelectMonthControlComponent } from '../../forms/select-month-control/select-month-control.component';

import { LoadingRotateDashedComponent } from '../../forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NoDataAvailableComponent } from '../../forms/no-data-available/no-data-available.component';
import { NgChartsModule } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-finance-weekly-breakdown',
    templateUrl: './finance-weekly-breakdown.component.html',
    styleUrls: ['./finance-weekly-breakdown.component.scss'],
    imports: [SelectYearControlComponent, FormsModule, SelectMonthControlComponent, LoadingRotateDashedComponent, NoDataAvailableComponent, NgChartsModule, TranslateModule]
})
export class FinanceWeeklyBreakdownComponent implements OnInit {
  public monthLabels = chartData.monthLabels;

  public barChartOptions: any = chartData.barChartOptions;
  public barChartType = chartData.barChartType;
  public barChartColors = chartData.barChartColors;

  public chartData = [];
  public labels = [];
  private currencyCodes = [];
  public showChart = true;
  public monthValue = null;
  public yearValue = null;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    const now = new Date();
    this.monthValue = now.getMonth() + 1;
    this.searchByYear( now.getFullYear() );
  }

  searchByMonth(value: number) {
    if( !this.showChart ) {
      return;
    }

    this.showChart = false;
    this.monthValue = value;
    this.reportService.getWeeklyBreakdown(this.monthValue).subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  searchByYear(value: number) {
    if( !this.showChart ) {
      return;
    }

    this.showChart = false;
    this.yearValue = value;
    this.reportService.getWeeklyBreakdown(this.monthValue, this.yearValue).subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  hasDataAvailable() {
    return this.chartData && this.chartData.length > 0;
  }

  processChartData(data: any[]) {

    this.reset();

    if (data.length === 0) {
      return this.showChart = true;
    }

    for (const prop of data) {

      /** Populate weeklybreakdown lables array */
      if (!this.labels.includes('Week ' + prop.week)) {
        this.labels.push('Week ' + prop.week);
      }

      /** Populate weeklybreakdown currencies array */
      if (!this.currencyCodes.includes(prop.currency_code)) {
        this.currencyCodes.push(prop.currency_code);
      }

    }

    /** Populate weeklybreakdown chart data array */
    for (let i = 0; i < this.currencyCodes.length; i++) {
      const label = this.currencyCodes[i];
      const dataset = [];

      /** Group data by {data: [...data], label: 'currency_code' } */
      for (const prop of data) {
        if ( prop.currency_code === label ) {
          dataset.push(prop.amount.toFixed(2));
        }
      }

      if ( dataset ) {
        this.chartData.push({
          data: dataset,
          label,
          ...this.barChartColors[0]
        });
      }

      this.showChart = true;
    }
  }

  reset(){
    this.labels = [];
    this.currencyCodes = [];
    this.chartData = [];
  }

}
