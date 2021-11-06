import { Component, OnInit } from '@angular/core';
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

  public weeklyBreakDownData = [];
  public weeklyBreakdownLabels = [];
  private weeklyBreakdownDataCurrencies = [];
  public showWeeklybreakdownChart = false;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.fetchWeeklyBreakdownReport();
  }


  fetchWeeklyBreakdownReport() {
    this.reportService.getWeeklyBreakdown().subscribe((data: any[]) => {
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

  }

}
