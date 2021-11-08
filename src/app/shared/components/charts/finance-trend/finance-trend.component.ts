import { Component, OnInit } from '@angular/core';
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
    this.fetchTotalsByCategory();
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

    if (data.length == 0) {
      return this.showChart = true;
    }

    this.reset();

    for (let i = 0; i < data.length; i++) {

      /** Populate trend currencies array with unique currency code */
      if (!this.currencyCodes.includes(data[i].currency_code)) {
        this.currencyCodes.push(data[i].currency_code);
      }
    }

    /** Populate trend chart data array */
    for (let i = 0; i < this.currencyCodes.length; i++) {
      let label = this.currencyCodes[i];
      let dataset = [];

      /** Group data by {data: [...data], label: 'currency_code' } */
      for (let j = 0; j < data.length; j++) {
        if (data[j].currency_code == label) {
          dataset.push(data[j].amount);
        }
      }

      /** Set chart data for trends */
      this.chartData.push({
        data: dataset, label: label,
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

}
