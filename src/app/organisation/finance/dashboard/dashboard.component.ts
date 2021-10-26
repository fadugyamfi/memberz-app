import { Component, OnDestroy, OnInit } from '@angular/core';
import { FinanceDashboardService } from 'src/app/shared/services/api/finance-dashboard.service';
import * as chartData from '../../../shared/data/chart/chartjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public monthLabels = chartData.monthLabels;
  public chartColors = chartData.chartColors;
  public barChartOptions: any = chartData.barChartOptions;
  public barChartType = chartData.barChartType;

  // lineGraph Chart
  public lineGraphOptions = chartData.lineGraphOptions;
  public lineGraphType = chartData.lineGraphType;


  // Doughnut
  public doughnutChartType = chartData.doughnutChartType;
  public doughnutChartColors = [];
  public doughnutChartOptions = chartData.doughnutChartOptions;


  private subscriptions: Subscription[] = [];

  public weeklyBreakDownData = [];
  public weeklyBreakdownLabels = [];
  private weeklyBreakdownDataCurrencies = [];
  public showWeeklybreakdownChart = false;


  public totalsByCategoryData = [];
  private totalsByCategoryDataCurrencies = [];
  public showTotalsByCategory = false;


  public trendData = [];
  public trendCurrencies = [];
  public showTrendChart = false;

  public categoryBreakdownData = [];
  public categoryBreakdownLables = [];
  public showCategoryBreakdownChart = false;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.fetchWeeklyBreakdownReport();
    this.fetchTotalsByCategory();
    this.fetchCategoryBreakdown();
  }

  fetchWeeklyBreakdownReport() {
    const sub =  this.reportService.getWeeklyBreakdown().subscribe((data: any[]) => {
      for (let i = 0; i < data.length; i++) {

        /** Populate weeklybreakdown lables array */
        if (!this.weeklyBreakdownLabels.includes('Week ' + data[i].week)) {
          this.weeklyBreakdownLabels.push('Week ' + data[i].week);
        }

        /** Populate weeklybreakdown currencies array */
        if (!this.weeklyBreakdownDataCurrencies.includes(data[i].currency_code)) {
          this.weeklyBreakdownDataCurrencies.push(data[i].currency_code);
        }

      }

      /** Populate weeklybreakdown chart data array */
      for (let i = 0; i < this.weeklyBreakdownDataCurrencies.length; i++) {
        let label = this.weeklyBreakdownDataCurrencies[i];
        let dataset = [];

        /** Group data by {data: [...data], label: 'currency_code' } */
        for (let j = 0; j < data.length; j++) {
          if (data[j].currency_code == label) {
            dataset.push(data[j].amount);
          }
        }

        this.weeklyBreakDownData.push({
          data: dataset, label: label,
          backgroundColor: this.chartColors[i].bgColor,
          borderColor: this.chartColors[i].bdColor,
          borderwidth: this.chartColors[i].bWidth
        });

        this.showWeeklybreakdownChart = true;
      }

    });

    this.subscriptions.push(sub);
  }

  fetchTotalsByCategory() {
    const sub =  this.reportService.getTotalsByCategory().subscribe((data: any[]) => {
      for (let i = 0; i < data.length; i++) {

        /** Populate totalsByCategory currencies array */
        if (!this.totalsByCategoryDataCurrencies.includes(data[i].currency_code)) {
          this.totalsByCategoryDataCurrencies.push(data[i].currency_code);
          this.trendCurrencies.push(data[i].currency_code);
        }
      }

      /** Populate totalsByCategory chart data array */
      for (let i = 0; i < this.totalsByCategoryDataCurrencies.length; i++) {
        let label = this.totalsByCategoryDataCurrencies[i];
        let dataset = [];

        /** Use totalsByCategory data for trend data */
        let trendLabel = this.trendCurrencies[i];
        let trendDataset = [];

        /** Group data by {data: [...data], label: 'currency_code' } */
        for (let j = 0; j < data.length; j++) {
          if (data[j].currency_code == label) {
            dataset.push(data[j].amount);
            trendDataset.push(data[j].amount);
          }
        }

        this.totalsByCategoryData.push({
          data: dataset, label: label,
          backgroundColor: this.chartColors[i].bgColor,
          borderColor: this.chartColors[i].bdColor,
          borderwidth: this.chartColors[i].bWidth
        });

        this.showTotalsByCategory = true;

        /** Set chart data for trends */
        this.trendData.push({
          data: trendDataset, label: trendLabel,
          backgroundColor: this.chartColors[i].bgColor,
          borderColor: this.chartColors[i].bdColor,
          borderwidth: this.chartColors[i].bWidth
        });

        this.showTrendChart = true;
      }

    });

    this.subscriptions.push(sub);
  }

  fetchCategoryBreakdown() {
    const sub =  this.reportService.getCategoryBreakdown().subscribe((data: any[]) => {
      for (let i = 0; i < data.length; i++) {

        /** Populate weeklybreakdown lables array */
        if (!this.categoryBreakdownLables.includes(data[i].contribution_type)) {
          this.categoryBreakdownLables.push(data[i].contribution_type);
        }

      }

      let dataset = [];

      /** Populate categoryBreakdown chart data array */
      for (let i = 0; i < this.categoryBreakdownLables.length; i++) {
        let label = this.categoryBreakdownLables[i];
      
        /** Group data by {data: [...data], label: 'contribution_type' } */
        for (let j = 0; j < data.length; j++) {
          if (data[j].contribution_type == label) {
            dataset.push(data[j].amount);
          }
        }

      }

      this.categoryBreakdownData.push(...dataset);
      this.showCategoryBreakdownChart = true;

    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // events
  public chartClicked(e: any): void { }

  public chartHovered(e: any): void { }


  public weeklyBreakDownByMonth($event): void {
    console.log($event);
  }

  public getDefaultWeeklyBreakDown() {

  }

  public categoryBreakDownByMonth($event): void {
    console.log($event);
  }

  public trend(year: number): void {

  }

  public getTotalsByCategory(year: number): void {

  }

  public getCategoryBreakdwon(year: number, month: number): void {

  }



}
