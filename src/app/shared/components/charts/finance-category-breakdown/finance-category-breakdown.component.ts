import { Component, OnInit } from '@angular/core';
import { FinanceDashboardService } from 'src/app/shared/services/api/finance-dashboard.service';
import * as chartData from '../../../data/chart/chartjs'

@Component({
  selector: 'app-finance-category-breakdown',
  templateUrl: './finance-category-breakdown.component.html',
  styleUrls: ['./finance-category-breakdown.component.scss']
})
export class FinanceCategoryBreakdownComponent implements OnInit {
  public chartColors = chartData.chartColors;
   // Doughnut
   public doughnutChartType = chartData.doughnutChartType;
   public doughnutChartColors = [];
   public doughnutChartOptions = chartData.doughnutChartOptions;


   public data = [];
   public labels = [];
   public currencyCodes = [];
   public showCategoryBreakdownChart = false;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.fetchCategoryBreakdown();
  }

  fetchCategoryBreakdown() {
    this.reportService.getCategoryBreakdown().subscribe((data: any[]) => {
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
      let dataset2 = [];
      let amount = 0;

      /**
       * Create a 3 dimentional array of 
       * [label1Amount, label2Amount, label3Amount] -> GHS
       * [label1Amount, label2Amount, label3Amount] -> USD
       * -------------, ------------,  ------------ ->  --
       */

      for (let i = 0; i < this.currencyCodes.length; i++) {

        for (let j = 0; j < this.labels.length; j++) {

          for (let k = 0; k < data.length; k++) {
            if ((data[k].contribution_type_name == this.labels[j]) && (data[k].currency_code == this.currencyCodes[i])) {
                amount = data[k].amount;
                continue;
            }
          }

          dataset.push(amount);
          amount = 0;
        }

        dataset2.push(dataset);
        dataset = [];
      }

      this.data = dataset2;
      this.showCategoryBreakdownChart = true;

    });
  }

}
