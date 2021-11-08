import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
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

  public chartData = [];
  private currencyCodes = [];
  public showChart = false;
  public yearValue: number = null;

  constructor(
    public reportService: FinanceDashboardService
  ) { }

  ngOnInit(): void {
    this.searchByYear( moment().year() );
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

      /** Populate totalsByCategory currencies array */
      if (!this.currencyCodes.includes(data[i].currency_code)) {
        this.currencyCodes.push(data[i].currency_code);
      }
    }

    /** Populate totalsByCategory chart data array */
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

    }

    this.showChart = true;
  }


  reset(){
    this.currencyCodes = [];
    this.chartData = [];
  }

}
