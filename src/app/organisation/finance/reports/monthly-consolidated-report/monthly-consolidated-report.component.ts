import { Component, OnInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { ContributionReceiptSettingService } from 'src/app/shared/services/api/contribution-receipt-setting.service';
import { ContributionReceiptSetting } from 'src/app/shared/model/api/contribution-receipt-setting';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

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
  public default_currency;
  public showData = false;

  constructor(
    public reportingService: FinanceReportingService,
    public receiptSettingService: ContributionReceiptSettingService
  ) { }

  ngOnInit(): void {
    this.fetchReceiptSettings();
  }

  fetchReportData(year : number, currencyId : number){
    this.showData = false;
    this.yearValue = year ? year : moment().year();
    this.default_currency = currencyId ? currencyId : this.default_currency;
    const sub = this.reportingService.getMonthlyConsolidatedReport(this.yearValue, this.default_currency).subscribe((data: any[]) => {
      this.showData = true;
      // this.reportData = data;

      console.log(data);
    });

    this.subscriptions.push(sub);
  }

  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe(settings => {
      this.default_currency = settings.default_currency;
      this.fetchReportData(moment().year(), this.default_currency);
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
