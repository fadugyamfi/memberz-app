import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FinanceReportingService } from '../../../../shared/services/api/finance-reporting.services';
import { ContributionReceiptSettingService } from '../../../../shared/services/api/contribution-receipt-setting.service';
import { ContributionReceiptSetting } from '../../../../shared/model/api/contribution-receipt-setting';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { SelectCurrencyControlComponent } from '../../../../shared/components/forms/select-currency-control/select-currency-control.component';
import { NgxPrintDirective } from 'ngx-print';
import { CurrencyPipe } from '@angular/common';
import { LoadingRotateDashedComponent } from '../../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NoDataAvailableComponent } from '../../../../shared/components/forms/no-data-available/no-data-available.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'app-income-summary',
    templateUrl: './income-summary.component.html',
    styleUrls: ['./income-summary.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, SelectCurrencyControlComponent, NgxPrintDirective, LoadingRotateDashedComponent, NoDataAvailableComponent, CurrencyPipe, TranslateModule]
})
export class IncomeSummaryComponent implements OnInit {

  public reportData: any[] = [];
  public rawData: any[] = [];
  public subscriptions: Subscription[] = [];
  public showData = false;
  public settings: ContributionReceiptSetting;
  public default_currency;
  public searchForm: UntypedFormGroup;
  public currency_code: string;


  constructor(
    public reportingService: FinanceReportingService,
    public receiptSettingService: ContributionReceiptSettingService,
    private fb: UntypedFormBuilder,
  ) {
    this.searchForm = fb.group({
      start_date: new UntypedFormControl(moment().format('YYYY-MM-DD')),
      end_date: new UntypedFormControl(moment().format('YYYY-MM-DD')),
      currency_id: new UntypedFormControl(this.default_currency)
    });
  }

  ngOnInit(): void {
    this.fetchReceiptSettings();
  }

  fetchReportData() {
    this.showData = false;
    const sub = this.reportingService.getIncomeSummary(this.searchForm.value).subscribe((data: any[]): void => {
      this.showData = true;
      this.reportData = data;
      this.rawData = data;
      if (data.length > 0) {
        this.processData(data);
      }
    });

    this.subscriptions.push(sub);
  }

  processData(data) {
    let contributionTypes = new Set;
    this.reportData = [];
    this.currency_code = data[0].currency_code;

    for (let d of data) {
      if (d.contribution_type_name != null) {
        contributionTypes.add(d.contribution_type_name);
      }
    }

    let contributionTypesArray = Array.from(contributionTypes);

    for (let contributiontype of contributionTypesArray) {
      let cashAmount = 0;
      let chequeAmount = 0;
      for (let d of data) {
        if (d.contribution_type_name == contributiontype && d.payment_type_name == "Cash") {
          cashAmount = d.amount;
        }

        if (d.contribution_type_name == contributiontype && d.payment_type_name == "Cheque") {
          chequeAmount = d.amount;
        }
      }

      this.reportData.push([contributiontype, cashAmount, chequeAmount, cashAmount + chequeAmount]);
    }

  }

  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe(settings => {
      this.default_currency = settings.default_currency;

      this.searchForm.patchValue({
        currency_id: this.default_currency
      });
      this.fetchReportData();
    });

    this.subscriptions.push(sub);
  }

  hasDataAvailable() {
    return this.reportData && this.reportData.length > 0;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get totalCash() {
    return this.rawData
      .filter(record => record.payment_type_name == 'Cash')
      .reduce((acc, record) => acc + record.amount, 0);
  }

  get totalCheques() {
    return this.rawData
      .filter(record => record.payment_type_name == 'Cheque')
      .reduce((acc, record) => acc + record.amount, 0);
  }

  get grandTotal() {
    return this.rawData.reduce((acc, record) => acc + record.amount, 0);
  }
}
