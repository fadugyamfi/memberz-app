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

  private monthObjLabels = chartData.monthObjLabels;
  public labels = [];
  private months = [];

  // lineGraph Chart
  public lineGraphOptions = chartData.lineGraphOptions;
  public lineGraphType = chartData.lineGraphType;


  public chartData = [];
  public currencyCodes = [];
  public showChart = true;
  public yearValue: number = null;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.searchByYear(moment().year());
  }

  searchByYear(value: number) {
    if( !this.showChart ) { return }

    this.showChart = false;
    this.yearValue = value;
    this.reportService.getTrendReport(this.yearValue).subscribe((data: any[]) => {
      this.processChartData(data);
    });
  }

  processChartData(data: any[]) {

    this.reset();

    if (data.length === 0) {
      return this.showChart = true;
    }

    let currencyCodesSet = new Set;
    let labelsSet = new Set;
    let monthsSets = new Set;

    /** Populate trend currencies array with unique currency code */
    for (const contribution of data) {
      currencyCodesSet.add(contribution.currency_code);
      labelsSet.add(this.monthObjLabels[contribution.month]);
      monthsSets.add(contribution.month);
    }

    this.currencyCodes = Array.from(currencyCodesSet);
    this.labels = Array.from(labelsSet);
    this.months = Array.from(monthsSets);

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

      for (const label of this.months) {

        for (const contribution of data) {
          if ((contribution.month === label) && (contribution.currency_code === currencyCode)) {
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
      // dataset = [];
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
