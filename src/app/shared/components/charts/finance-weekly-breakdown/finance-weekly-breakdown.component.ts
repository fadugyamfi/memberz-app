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
  public chartColors = chartData.chartColors;

  public barChartOptions: any = chartData.barChartOptions;
  public barChartType = chartData.barChartType;

  public chartData = [];
  public labels = [];
  private currencyCodes = [];
  public showChart = false;
  public monthValue = null;
  public yearValue = null;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.monthValue = moment().month() + 1;
    this.searchByYear( moment().year() );
  }

  fetchWeeklyBreakdownReport() {
    this.reportService.getWeeklyBreakdown().subscribe((data: any[]) => {
      this.processChartData(data);
    });

  }

  searchByMonth(value: number) {
    this.showChart = false;
    this.monthValue = value;
    this.reportService.getWeeklyBreakdown(this.monthValue).subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  searchByYear(value: number) {
    this.showChart = false;
    this.yearValue = value;
    this.reportService.getWeeklyBreakdown(this.monthValue, this.yearValue).subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  processChartData(data: any[]) {

    if (data.length == 0) {
      return this.showChart = true;
    }

    this.reset();

    for (let i = 0; i < data.length; i++) {

      /** Populate weeklybreakdown lables array */
      if (!this.labels.includes('Week ' + data[i].week)) {
        this.labels.push('Week ' + data[i].week);
      }

      /** Populate weeklybreakdown currencies array */
      if (!this.currencyCodes.includes(data[i].currency_code)) {
        this.currencyCodes.push(data[i].currency_code);
      }

    }

    /** Populate weeklybreakdown chart data array */
    for (let i = 0; i < this.currencyCodes.length; i++) {
      let label = this.currencyCodes[i];
      let dataset = [];

      /** Group data by {data: [...data], label: 'currency_code' } */
      for (let j = 0; j < data.length; j++) {
        if (data[j].currency_code == label) {
          dataset.push(data[j].amount);
        }
      }

      this.chartData.push({
        data: dataset, label: label,
        backgroundColor: this.chartColors[i].bgColor,
        borderColor: this.chartColors[i].bdColor,
        borderwidth: this.chartColors[i].bWidth
      });

      this.showChart = true;
    }
  }

  reset(){
    this.labels = [];
    this.currencyCodes = [];
    this.chartData = [];
  }

}
