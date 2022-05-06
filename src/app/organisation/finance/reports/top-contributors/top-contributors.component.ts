import { Component, OnInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ContributionReceiptSettingService } from 'src/app/shared/services/api/contribution-receipt-setting.service';
import { ContributionReceiptSetting } from 'src/app/shared/model/api/contribution-receipt-setting';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-top-contributors',
  templateUrl: './top-contributors.component.html',
  styleUrls: ['./top-contributors.component.scss']
})
export class TopContributorsComponent implements OnInit {

  public reportData = [];
  public subscriptions: Subscription[] = [];
  public yearValue: number = moment().year();
  public showData = false;
  public settings: ContributionReceiptSetting;
  public default_currency = 80;
  public searchForm: FormGroup;

  constructor(
    public reportingService: FinanceReportingService,
    public receiptSettingService: ContributionReceiptSettingService
  ) { }

  ngOnInit(): void {
    this.setupSearchForm();
    this.fetchReceiptSettings();
  }

  setupSearchForm() {
    this.searchForm = new FormGroup({
      year: new FormControl(moment().year()),
      currency_id: new FormControl(this.default_currency)
    });
  }

  fetchReportData(event){
    event.preventDefault();

    this.showData = false;

    const sub = this.reportingService.getTopContributors(
      this.searchForm.value.year,
      this.searchForm.value.currency_id
    ).subscribe((data: any[]) => {
      this.showData = true;
      this.reportData = data;
    });

    this.subscriptions.push(sub);
  }

  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe(settings => {
      this.default_currency = settings.default_currency;
      // this.fetchReportData(moment().year(), this.default_currency);
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
