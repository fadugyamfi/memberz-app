import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FinanceDashboardService } from 'src/app/shared/services/api/finance-dashboard.service';
import * as chartData from '../../../data/chart/chartjs';

@Component({
  selector: 'app-finance-totals-by-category',
  templateUrl: './finance-totals-by-category.component.html',
  styleUrls: ['./finance-totals-by-category.component.scss']
})
export class FinanceTotalsByCategoryComponent implements OnInit {
  public barChartOptions: any = chartData.barChartOptions;
  public barChartType = chartData.barChartType;

  public chartData = [];
  public labels = [];
  private currencyCodes = [];
  public showChart = false;
  public yearValue: number = null;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.searchByYear(moment().year());
  }

  searchByYear(value: number) {
    this.showChart = false;
    this.yearValue = value;
    this.reportService.getTotalsByCategory(this.yearValue).subscribe((data: any[]) => {
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

    for (const contribution of data) {

      /** Populate unique currency codes array */
      if (!this.currencyCodes.includes(contribution.currency_code)) {
        this.currencyCodes.push(contribution.currency_code);
      }

      /** Populate unique chart labels/categories */
      if (!this.labels.includes(contribution.contribution_type_name)) {
        this.labels.push(contribution.contribution_type_name);
      }

    }

    let dataset = [];
    const dataset2 = [];
    let amount = 0;

    /**
     * Create a 3 dimentional array of
     * [label1Amount, label2Amount, label3Amount] -> GHS
     * [label1Amount, label2Amount, label3Amount] -> USD
     * -------------, ------------,  ------------ ->  --
     */

    for (const currencyCode of this.currencyCodes) {

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


      dataset2.push(dataset);
      if (dataset) {
        this.chartData.push({
          data: dataset,
          label: currencyCode
        });
      }
      dataset = [];
    }

    this.showChart = true;
  }


  reset() {
    this.currencyCodes = [];
    this.chartData = [];
  }

}
