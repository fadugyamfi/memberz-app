import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartData, ChartDataset } from 'chart.js';
import { FinanceDashboardService } from '../../../services/api/finance-dashboard.service';
import * as chartData from '../../../data/chart/chartjs';
import { OrganisationService } from '../../../services/api/organisation.service';
import { SelectContributionTypeControlComponent } from '../../forms/select-contribution-type-control/select-contribution-type-control.component';
import { SelectYearControlComponent } from '../../forms/select-year-control/select-year-control.component';
import { NgIf } from '@angular/common';
import { LoadingRotateDashedComponent } from '../../forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NoDataAvailableComponent } from '../../forms/no-data-available/no-data-available.component';
import { RouterLink } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-finance-trend',
    templateUrl: './finance-trend.component.html',
    styleUrls: ['./finance-trend.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, SelectContributionTypeControlComponent, SelectYearControlComponent, NgIf, LoadingRotateDashedComponent, NoDataAvailableComponent, RouterLink, NgChartsModule, TranslateModule]
})
export class FinanceTrendComponent implements OnInit {


  @Input() title = 'Income Trend';

  private monthObjLabels = chartData.monthObjLabels;
  public labels = [];
  private months = [];

  // lineGraph Chart
  public lineGraphOptions = chartData.lineGraphOptions;
  public lineGraphType = chartData.lineGraphType;
  public lineGraphColors = chartData.lineGraphColors;


  public chartData: ChartDataset[] = [];
  public currencyCodes = [];
  public showChart = true;
  public yearValue: number = null;

  public chartForm: UntypedFormGroup;

  constructor(
    public reportService: FinanceDashboardService,
    public organisationService: OrganisationService
  ) { }

  ngOnInit(): void {
    this.setupForm();
    this.fetchData(new Date().getFullYear());
  }

  setupForm() {
    this.chartForm = new UntypedFormGroup({
      year: new UntypedFormControl(new Date().getFullYear()),
      contribution_type_id: new UntypedFormControl()
    });

    this.chartForm.valueChanges.subscribe(values => {
      this.fetchData(values.year, values.contribution_type_id);
    })
  }

  fetchData(year: number, contribution_type_id: number = null) {
    this.showChart = false;

    this.reportService.getTrendReport(year, contribution_type_id).subscribe((data: any[]) => {
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

    /**
     * Create a 3 dimentional array of
     * [label1Amount, label2Amount, label3Amount] -> GHS
     * [label1Amount, label2Amount, label3Amount] -> USD
     * -------------, ------------,  ------------ ->  --
     */

    for (const currencyCode of this.currencyCodes) {

      for (const label of this.months) {
        let amount = 0;

        for (const contribution of data) {
          if ((contribution.month === label) && (contribution.currency_code === currencyCode)) {
            amount = contribution.amount;
            continue;
          }
        }

        dataset.push(amount.toFixed(2));
        amount = 0;

      }

      this.chartData.push({
        data: dataset,
        label: currencyCode,
        tension: 0.4
        // ...this.lineGraphColors[0]
      });

      dataset = [];
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

  canShowWidgetData() {
    return this.showChart && this.hasDataAvailable() && this.canAccessFinance();
  }

  canAccessFinance() {
    const org = this.organisationService.getActiveOrganisation();
    if( !org ) return false;

    return org.active_subscription?.canAccessFinance();
  }
}
