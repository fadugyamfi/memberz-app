import { Component, OnInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { Subscription } from 'rxjs';
import { ContributionReceiptSettingService } from 'src/app/shared/services/api/contribution-receipt-setting.service';
import { ContributionReceiptSetting } from 'src/app/shared/model/api/contribution-receipt-setting';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectYearControlComponent } from '../../../../shared/components/forms/select-year-control/select-year-control.component';
import { SelectCurrencyControlComponent } from '../../../../shared/components/forms/select-currency-control/select-currency-control.component';
import { NgxPrintDirective } from 'ngx-print';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { LoadingRotateDashedComponent } from '../../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NoDataAvailableComponent } from '../../../../shared/components/forms/no-data-available/no-data-available.component';
import { ViewProfileDirective } from '../../../../shared/directives/view-profile.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-top-contributors',
    templateUrl: './top-contributors.component.html',
    styleUrls: ['./top-contributors.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, SelectYearControlComponent, SelectCurrencyControlComponent, NgxPrintDirective, NgIf, LoadingRotateDashedComponent, NoDataAvailableComponent, NgFor, ViewProfileDirective, CurrencyPipe, DatePipe, TranslateModule]
})
export class TopContributorsComponent implements OnInit {

  public reportData = [];
  public subscriptions: Subscription[] = [];
  public yearValue: number = new Date().getFullYear();
  public showData = false;
  public settings: ContributionReceiptSetting;
  public default_currency = 80;
  public searchForm: UntypedFormGroup;

  constructor(
    public reportingService: FinanceReportingService,
    public receiptSettingService: ContributionReceiptSettingService
  ) { }

  ngOnInit(): void {
    this.setupSearchForm();
    this.fetchReceiptSettings();
  }

  setupSearchForm() {
    this.searchForm = new UntypedFormGroup({
      year: new UntypedFormControl( new Date().getFullYear() ),
      currency_id: new UntypedFormControl(this.default_currency)
    });
  }

  fetchReportData(){
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

}
