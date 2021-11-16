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
  public startYearValue: number = moment().year();
  public endYearValue: number = moment().year();
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

  fetchReportData(value : number){
    this.showData = false;
    this.startYearValue = value ? value : moment().year();
    const sub = this.reportingService.getNonContributingMembers(this.startYearValue).subscribe((data: any[]) => {
      this.showData = true;
      this.reportData = data;
    });

    this.subscriptions.push(sub);
  }

  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe(settings => {
      this.default_currency = settings.default_currency;
      this.fetchReportData(moment().year());
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
