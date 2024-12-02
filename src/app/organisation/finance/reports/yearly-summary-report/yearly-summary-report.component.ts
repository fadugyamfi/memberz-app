import { Component, OnInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { ContributionReceiptSettingService } from 'src/app/shared/services/api/contribution-receipt-setting.service';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContributionReceiptSetting } from 'src/app/shared/model/api/contribution-receipt-setting';
import { Subscription } from 'rxjs';
import { CurrencyService } from '../../../../shared/services/api/currency.service';
import { SelectYearControlComponent } from '../../../../shared/components/forms/select-year-control/select-year-control.component';
import { SelectCurrencyControlComponent } from '../../../../shared/components/forms/select-currency-control/select-currency-control.component';
import { NgxPrintDirective } from 'ngx-print';
import { DecimalPipe } from '@angular/common';
import { LoadingRotateDashedComponent } from '../../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NoDataAvailableComponent } from '../../../../shared/components/forms/no-data-available/no-data-available.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'app-yearly-summary-report',
    templateUrl: './yearly-summary-report.component.html',
    styleUrls: ['./yearly-summary-report.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, SelectYearControlComponent, SelectCurrencyControlComponent, NgxPrintDirective, LoadingRotateDashedComponent, NoDataAvailableComponent, DecimalPipe, TranslateModule]
})
export class YearlySummaryReportComponent implements OnInit {

  public reportData = [];
  public subscriptions: Subscription[] = [];
  public yearValue: number = new Date().getFullYear();
  public settings: ContributionReceiptSetting;
  public default_currency: number;
  public default_currency_code: string;
  public selected_currency_code: string;
  public showData = false;

  public contributionTypesData: any[] = [];
  public paymentTypesData: any[] = [];


  public paymentTypeNames: string[] = [];
  public contributionTypeNames: string[] = [];
  public months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  public searchForm: UntypedFormGroup;


  constructor(
    public reportingService: FinanceReportingService,
    public receiptSettingService: ContributionReceiptSettingService,
    private fb: UntypedFormBuilder,
    public currencyService: CurrencyService
  ) {

  }

  ngOnInit(): void {
    this.fetchReceiptSettings();
    this.setupSearchForm();
  }

  setupSearchForm() {
    this.searchForm = this.fb.group({
      year: new UntypedFormControl( new Date().getFullYear()),
      currency_id: new UntypedFormControl(this.default_currency)
    });

    this.searchForm.valueChanges.subscribe(values => {
      this.selected_currency_code = this.currencyService.getItem(values.currency_id).currency_code;
    });
  }

  fetchReportData() {
    this.showData = false;

    const sub = this.reportingService.getYearlySummaryReport(this.searchForm.value).subscribe((data: { contributionTypesData: any[], paymentTypesData: any[] }) => {
      this.showData = true;

      const unique = (value, index, self) => self.indexOf(value) === index;

      this.contributionTypeNames = data.contributionTypesData
        .map(record => record.contribution_type_name)
        .filter(unique);

      this.contributionTypesData = data.contributionTypesData;
      this.default_currency_code = data.contributionTypesData[0]?.currency_code;

      this.paymentTypesData = data.paymentTypesData;
      this.paymentTypeNames = data.paymentTypesData
        .map(record => record.payment_type_name)
        .filter(unique);
    });

    this.subscriptions.push(sub);
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getContributionByTypeNameAndMonth(typeName: string, month: string) {
    return this.contributionTypesData.find(record => record.contribution_type_name == typeName && record.month_name == month);
  }

  getContributionsByTypeName(typeName: string) {
    return this.contributionTypesData.filter(record => record.contribution_type_name == typeName);
  }

  getTotalContributionByTypeName(typeName: string) {
    return this.getContributionsByTypeName(typeName).reduce((acc, record) => acc + record.amount, 0);
  }

  getTotalContributionByMonth(month: string) {
    return this.contributionTypesData
      .filter(record => record.month_name == month)
      .reduce((acc, record) => acc + record.amount, 0);
  }

  getTotalContribution() {
    return this.contributionTypesData.reduce((acc, record) => acc + record.amount, 0);
  }

  getPaymentsTypeNameAndMonth(typeName: string, month: number) {
    return this.paymentTypesData.find(record => record.payment_type_name == typeName && record.month == month)
  }

  getTotalPaymentByMonth(month) {
    return this.paymentTypesData
      .filter(record => record.month == month)
      .reduce((acc, record) => acc + record.amount, 0);
  }

  getTotalByPaymentType(typeName) {
    return this.paymentTypesData
      .filter(record => record.payment_type_name == typeName)
      .reduce((acc, record) => acc + record.amount, 0);
  }

  getTotalPayments() {
    return this.paymentTypesData.reduce((acc, record) => acc + record.amount, 0);
  }
}
