import { Component, OnInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { ContributionReceiptSettingService } from 'src/app/shared/services/api/contribution-receipt-setting.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ContributionReceiptSetting } from 'src/app/shared/model/api/contribution-receipt-setting';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as chartData from '../../../../shared/data/chart/chartjs';


@Component({
  selector: 'app-monthly-consolidated-report',
  templateUrl: './monthly-consolidated-report.component.html',
  styleUrls: ['./monthly-consolidated-report.component.scss']
})
export class MonthlyConsolidatedReportComponent implements OnInit {

  public reportData = [];
  public subscriptions: Subscription[] = [];
  public yearValue: number = moment().year();
  public settings: ContributionReceiptSetting;
  public default_currency: number;
  public default_currency_code: string;
  public showData = false;
  private monthObjLabels = chartData.monthObjLabels;
  public contributionTypesData: any[] = [];
  public paymentTypesData: any[] = [];
  public contributionTypes: any[] = [];
  public paymentTypes: any[] = [];
  public contributionTypesReportData: any[] = [];
  public paymentTypesReportData: any[] = [];

  public searchForm: FormGroup;
  

  constructor(
    public reportingService: FinanceReportingService,
    public receiptSettingService: ContributionReceiptSettingService,
    private fb: FormBuilder,
  ) { 
    this.searchForm = fb.group({
      year: new FormControl(moment().year()),
      currency_id: new FormControl(this.default_currency)
    });
  }

  ngOnInit(): void {
    this.fetchReceiptSettings();
  }

  fetchReportData() {
    const sub = this.reportingService.getMonthlyConsolidatedReport(this.searchForm.value).subscribe((data: { contributionTypesData: any[], paymentTypesData: any[] }) => {
      this.showData = true;

      this.contributionTypesData = data.contributionTypesData;
      this.setContributionTypes(this.contributionTypesData);
      this.setContributionTypesReportData(this.contributionTypesData);

      this.paymentTypesData = data.paymentTypesData;
      this.setPaymentTypes(this.paymentTypesData);
      this.setPaymentTypesReportData(this.paymentTypesData);
    });

    this.subscriptions.push(sub);
  }

  setContributionTypes(data: any[]) {
    let types = new Set;

    data.forEach(d => {
      if (d.contribution_type_name != null){
        types.add(d.contribution_type_name);
      }
    });

    this.contributionTypes = Array.from(types);
  }

  setContributionTypesReportData(data: any[]) {
    let datasetInner = [];
    let dataSetOuter = [];
    let total = 0;

    for (let type of this.contributionTypes) {
      for (let monthValue of Object.keys(this.monthObjLabels)) {
        let value = 0.00;
        for (let d of data) {
          if (d.month == monthValue && d.contribution_type_name == type) {
            value = d.amount;
          }
        }

        total += value;

        datasetInner.push(value);
      }

      datasetInner.push(total);

      dataSetOuter.push(datasetInner);
      datasetInner = [];
      total = 0;
    }

    this.contributionTypesReportData = dataSetOuter;
  }


  setPaymentTypesReportData(data: any[]) {
    let datasetInner = [];
    let dataSetOuter = [];
    let total = 0;

    for (let type of this.paymentTypes) {
      for (let monthValue of Object.keys(this.monthObjLabels)) {
        let value = 0.00;
        for (let d of data) {
          if (d.month == monthValue && d.payment_type_name == type) {
            value = d.amount;
          }
        }

        total += value;
        datasetInner.push(value);
      }

      datasetInner.push(total);

      dataSetOuter.push(datasetInner);
      datasetInner = [];
      total = 0;
    }

    this.paymentTypesReportData = dataSetOuter;
  }

  setPaymentTypes(data: any[]) {
    let types = new Set;

    data.forEach(d => {
      if (d.payment_type_name != null) {
        types.add(d.payment_type_name);
      }
    });

    this.paymentTypes = Array.from(types);
  }


  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe(settings => {
      this.default_currency = settings.default_currency;
      this.default_currency_code = settings.default_currency_code;
      this.searchForm.patchValue({
        currency_id: this.default_currency
      });
      this.fetchReportData();
    });

    this.subscriptions.push(sub);
  }

  hasDataAvailable() {
    return (this.contributionTypesData && this.contributionTypesData.length > 0) ||
      (this.paymentTypesData && this.paymentTypesData.length > 0);
  }

  getMonthInts() {
    return Object.keys(this.monthObjLabels);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
