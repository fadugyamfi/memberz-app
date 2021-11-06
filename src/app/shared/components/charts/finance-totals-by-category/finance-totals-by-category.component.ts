import { Component, OnInit } from '@angular/core';
import { FinanceDashboardService } from 'src/app/shared/services/api/finance-dashboard.service';
import * as chartData from '../../../data/chart/chartjs'

@Component({
  selector: 'app-finance-totals-by-category',
  templateUrl: './finance-totals-by-category.component.html',
  styleUrls: ['./finance-totals-by-category.component.scss']
})
export class FinanceTotalsByCategoryComponent implements OnInit {
  public monthLabels = chartData.monthLabels;
  public chartColors = chartData.chartColors;

  public barChartOptions: any = chartData.barChartOptions;
  public barChartType = chartData.barChartType;

  public totalsByCategoryData = [];
  private totalsByCategoryDataCurrencies = [];
  public showTotalsByCategory = false;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.fetchTotalsByCategory();
  }

  fetchTotalsByCategory() {
    this.reportService.getTotalsByCategory().subscribe((data: any[]) => {
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
          data: dataset, label: label,
          backgroundColor: this.chartColors[i].bgColor,
          borderColor: this.chartColors[i].bdColor,
          borderwidth: this.chartColors[i].bWidth
        });

      }

      this.showTotalsByCategory = true;

    });
  }

}
