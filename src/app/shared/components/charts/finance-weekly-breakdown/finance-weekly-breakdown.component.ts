import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FinanceDashboardService } from 'src/app/shared/services/api/finance-dashboard.service';
import * as chartData from '../../../data/chart/chartjs';

@Component({
  selector: 'app-finance-weekly-breakdown',
  templateUrl: './finance-weekly-breakdown.component.html',
  styleUrls: ['./finance-weekly-breakdown.component.scss']
})
export class FinanceWeeklyBreakdownComponent implements OnInit {
  public monthLabels = chartData.monthLabels;

  public barChartOptions: any = chartData.barChartOptions;
  public barChartType = chartData.barChartType;

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
    this.monthValue = moment().month() + 1;
    this.searchByYear( moment().year() );
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
          label
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
