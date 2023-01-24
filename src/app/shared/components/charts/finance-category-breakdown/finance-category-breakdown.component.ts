import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { FinanceDashboardService } from 'src/app/shared/services/api/finance-dashboard.service';
import * as chartData from '../../../data/chart/chartjs';

@Component({
  selector: 'app-finance-category-breakdown',
  templateUrl: './finance-category-breakdown.component.html',
  styleUrls: ['./finance-category-breakdown.component.scss']
})
export class FinanceCategoryBreakdownComponent implements OnInit {

  public chartData: any;
  public labels = [];
  public currencyCodes = [];
  public showChart = true;
  public monthValue: number = null;
  public yearValue: number = null;

  // Doughnut
  public doughnutChartType = chartData.doughnutChartType;
  public doughnutChartOptions = chartData.doughnutChartOptions;
  public doughnutChartColor = chartData.doughnutChartColors;
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.labels,
    datasets: []
  };

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    const now = new Date();
    this.monthValue = now.getMonth() + 1;
    this.searchByYear(now.getFullYear());
  }

  fetchCategoryBreakdown() {
    this.reportService.getCategoryBreakdown().subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  hasDataAvailable() {
    return  this.doughnutChartData.datasets && this.doughnutChartData.datasets.length > 0;
  }

  processChartData(data: any[]) {
    this.reset();

    if (data.length === 0) {
      return this.showChart = true;
    }


    data.forEach((d, index) => {
      /** Populate weeklybreakdown unique lables array */
      if (!this.labels.includes(data[index].contribution_type_name)) {
        this.labels.push(data[index].contribution_type_name);
      }

      /** Populate weeklybreakdown unique currencies array */
      if (!this.currencyCodes.includes(data[index].currency_code)) {
        this.currencyCodes.push(data[index].currency_code);
      }
    });


    let dataset = [];
    const dataset2 = [];
    let amount = 0;

    /**
     * Create a 3 dimentional array of
     * [label1Amount, label2Amount, label3Amount] -> GHS
     * [label1Amount, label2Amount, label3Amount] -> USD
     * -------------, ------------,  ------------ ->  --
     */

    for (const currencyCode of this.currencyCodes) { // let i = 0; i < this.currencyCodes.length; i++) {

      for (const label of this.labels) {

        for (const contribution of data) {
          if ((contribution.contribution_type_name === label) && (contribution.currency_code === currencyCode)) {
              amount = contribution.amount;
              continue;
          }
        }

        dataset.push(amount.toFixed(2));
        amount = 0;
      }

      this.doughnutChartData.datasets.push({
        data: dataset,
        ...chartData.doughnutChartColors[0]
      });

      dataset = [];
    }

    this.doughnutChartData.labels = this.labels;
    this.showChart = true;
  }

  searchByMonth(value: number) {
    if( !this.showChart ) {
      return;
    }

    this.showChart = false;
    this.monthValue = value;
    this.reportService.getCategoryBreakdown(this.monthValue).subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  searchByYear(value: number) {
    if( !this.showChart ) {
      return;
    }

    this.showChart = false;
    this.yearValue = value;
    this.reportService.getCategoryBreakdown(this.monthValue, this.yearValue).subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  reset(){
    this.labels = [];
    this.currencyCodes = [];
    this.chartData = [];
  }

}
