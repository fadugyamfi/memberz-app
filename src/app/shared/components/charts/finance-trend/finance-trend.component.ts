import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FinanceDashboardService } from 'src/app/shared/services/api/finance-dashboard.service';
import * as chartData from '../../../data/chart/chartjs';

@Component({
  selector: 'app-finance-trend',
  templateUrl: './finance-trend.component.html',
  styleUrls: ['./finance-trend.component.scss']
})
export class FinanceTrendComponent implements OnInit {

  public monthLabels = chartData.monthLabels;
  public chartColors = chartData.chartColors;

  // lineGraph Chart
  public lineGraphOptions = chartData.lineGraphOptions;
  public lineGraphType = chartData.lineGraphType;


  public chartData = [];
  public currencyCodes = [];
  public showChart = false;
  public yearValue: number = null;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.searchByYear( moment().year() );
  }

  fetchTotalsByCategory() {
    this.reportService.getTotalsByCategory().subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  searchByYear(value: number) {
    this.showChart = false;
    this.yearValue = value;
    this.reportService.getTotalsByCategory(this.yearValue).subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  processChartData(data: any[]) {

    if (data.length === 0) {
      return this.showChart = true;
    }

    this.reset();

    /** Populate trend currencies array with unique currency code */
    for (const contribution of data) {
      if (!this.currencyCodes.includes(contribution.currency_code)) {
        this.currencyCodes.push(contribution.currency_code);
      }
    }

    /** Populate trend chart data array */
    for (let i = 0; i < this.currencyCodes.length; i++) {
      const label = this.currencyCodes[i];
      const dataset = [];

      /** Group data by {data: [...data], label: 'currency_code' } */
      for (const contribution of data) {
        if (contribution.currency_code === label) {
          dataset.push(contribution.amount.toFixed(2));
        }
      }

      /** Set chart data for trends */
      this.chartData.push({
        data: dataset,
        label,
        backgroundColor: this.chartColors[i].bgColor,
        borderColor: this.chartColors[i].bdColor,
        borderwidth: this.chartColors[i].bWidth
      });

    }

    this.showChart = true;

  }

  reset() {
    this.currencyCodes = [];
    this.chartData = [];
  }

  hasDataAvailable() {
    return this.chartData && this.chartData.length > 0;
  }

}
