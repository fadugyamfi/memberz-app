import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FinanceDashboardService } from 'src/app/shared/services/api/finance-dashboard.service';
import * as chartData from '../../../shared/data/chart/chartjs';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public monthLabels = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", 'Oct', "Nov", "Dec"];
  private subscriptions: Subscription[] = [];
  public weeklyBreakDownData = [];
  public weeklyBreakdownLabels = [];
  public weeklyBreadownData = [];
  private weeklyBreakdownDataCurrencies = [];


  public totalsByCategoryData = [];
  public
  private totalsByCategoryDataCurrencies = [];



  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.fetchWeeklyBreakdownReport();
    this.fetchTotalsByCategory();
  }

  fetchWeeklyBreakdownReport() {
    return this.reportService.getWeeklyBreakdown().subscribe((data: any[]) => {
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

        this.weeklyBreadownData.push({
          data: dataset, label: label
        });
      }

    });
  }

  fetchTotalsByCategory() {
    return this.reportService.getTotalsByCategory().subscribe((data: any[]) => {
      for (let i = 0; i < data.length; i++) {

        /** Populate totalsByCategory currencies array */
        if (!this.totalsByCategoryDataCurrencies.includes(data[i].currency_code)) {
          this.totalsByCategoryDataCurrencies.push(data[i].currency_code);
        }
      }

      /** Populate totalsByCategory chart data array */
      for (let i = 0; i < this.totalsByCategoryDataCurrencies.length; i++) {
        let label = this.totalsByCategoryDataCurrencies[i];
        let dataset = [];

        /** Group data by {data: [...data], label: 'currency_code' } */
        for (let j = 0; j < data.length; j++) {
          if (data[j].currency_code == label) {
            dataset.push(data[j].amount);
          }
        }

        this.totalsByCategoryData.push({
          data: dataset, label: label
        });
      }
    });
  }

  // barChart
  public barChartOptions = chartData.barChartOptions;
  public barChartLabels = chartData.barChartLabels;
  public barChartType = chartData.barChartType;
  public barChartLegend = chartData.barChartLegend;
  public barChartData = chartData.barChartData;
  public barChartColors = chartData.barChartColors;

  // lineGraph Chart
  public lineGraphOptions = chartData.lineGraphOptions;
  public lineGraphLabels = chartData.lineGraphLabels;
  public lineGraphType = chartData.lineGraphType;
  public lineGraphLegend = chartData.lineGraphLegend;
  public lineGraphData = chartData.lineGraphData;
  public lineGraphColors = chartData.lineGraphColors;

  // lineChart
  public lineChartData = chartData.lineChartData;
  public lineChartLabels = chartData.lineChartLabels;
  public lineChartOptions = chartData.lineChartOptions;
  public lineChartColors = chartData.lineChartColors;
  public lineChartLegend = chartData.lineChartLegend;
  public lineChartType = chartData.lineChartType;

  // Doughnut
  public doughnutChartLabels = chartData.doughnutChartLabels;
  public doughnutChartData = chartData.doughnutChartData;
  public doughnutChartType = chartData.doughnutChartType;
  public doughnutChartColors = chartData.doughnutChartColors;
  public doughnutChartOptions = chartData.doughnutChartOptions;


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
