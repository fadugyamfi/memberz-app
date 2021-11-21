import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { ContributionReceiptSettingService } from 'src/app/shared/services/api/contribution-receipt-setting.service';
import { ContributionReceiptSetting } from 'src/app/shared/model/api/contribution-receipt-setting';
import { Subscription } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'app-income-summary',
  templateUrl: './income-summary.component.html',
  styleUrls: ['./income-summary.component.scss']
})
export class IncomeSummaryComponent implements OnInit {

  public reportData = [];
  public subscriptions: Subscription[] = [];
  public startDateValue = moment().format('YYYY-MM-DD');
  public endDateValue = moment().format('YYYY-MM-DD');
  public showData = false;
  public settings: ContributionReceiptSetting;
  public default_currency;


  constructor(
    public reportingService: FinanceReportingService,
    public receiptSettingService: ContributionReceiptSettingService
  ) { }

  ngOnInit(): void {
    this.fetchReceiptSettings();
  }

  fetchReportData(startDate = null, endDate = null, currencyId = null){
    this.showData = false;
    this.startDateValue = startDate ? startDate : moment();
    this.endDateValue = endDate ? endDate : moment();
    this.default_currency = currencyId ? currencyId : this.default_currency;
    const sub = this.reportingService.getIncomeSummary(this.startDateValue, this.endDateValue, this.default_currency).subscribe((data: any[]) => {
      this.showData = true;
      this.reportData = data;
    });

    this.subscriptions.push(sub);
  }

  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe(settings => {
      this.default_currency = settings.default_currency;
      this.fetchReportData(moment(), moment(), this.default_currency);
    });

    this.subscriptions.push(sub);
  }

  hasDataAvailable() {
    return this.reportData && this.reportData.length > 0;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
