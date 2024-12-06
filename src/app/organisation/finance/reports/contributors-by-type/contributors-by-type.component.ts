import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContributionReceiptSetting } from '../../../../shared/model/api/contribution-receipt-setting';
import { ContributionReceiptSettingService } from '../../../../shared/services/api/contribution-receipt-setting.service';
import { FinanceReportingService } from '../../../../shared/services/api/finance-reporting.services';
import moment from 'moment';
import Swal from 'sweetalert2';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ExcelService } from '../../../../shared/services/excel.service';
import { SelectContributionTypeControlComponent } from '../../../../shared/components/forms/select-contribution-type-control/select-contribution-type-control.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SelectCurrencyControlComponent } from '../../../../shared/components/forms/select-currency-control/select-currency-control.component';
import { NgxPrintDirective } from 'ngx-print';
import { LoadingRotateDashedComponent } from '../../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NoDataAvailableComponent } from '../../../../shared/components/forms/no-data-available/no-data-available.component';
import { ViewProfileDirective } from '../../../../shared/directives/view-profile.directive';

@Component({
    selector: 'app-contributors-by-type',
    templateUrl: './contributors-by-type.component.html',
    styleUrls: ['./contributors-by-type.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, SelectContributionTypeControlComponent, SelectCurrencyControlComponent, NgxPrintDirective, LoadingRotateDashedComponent, NoDataAvailableComponent, ViewProfileDirective, CurrencyPipe, DatePipe, TranslateModule]
})
export class ContributorsByTypeComponent implements OnInit {

  public reportData = [];
  public subscriptions: Subscription[] = [];
  public showData = true;
  public settings: ContributionReceiptSetting;
  public default_currency = 80;
  public searchForm: UntypedFormGroup;

  constructor(
    public reportingService: FinanceReportingService,
    public receiptSettingService: ContributionReceiptSettingService,
    public translate: TranslateService,
    public excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.setupSearchForm();
    this.fetchReceiptSettings();
  }

  setupSearchForm() {
    this.searchForm = new UntypedFormGroup({
      contribution_type_id: new UntypedFormControl('', [Validators.required]),
      year: new UntypedFormControl(''),
      currency_id: new UntypedFormControl(this.default_currency, [Validators.required]),
      start_date: new UntypedFormControl('', [Validators.required]),
      end_date: new UntypedFormControl('', [Validators.required]),
      limit: new FormControl<number>(200)
    });
  }

  fetchReportData(){
    this.showData = false;

    const sub = this.reportingService.getContributorsByType(this.searchForm.value)
      .subscribe((data: any[]) => {
        this.showData = true;
        this.reportData = data;
      });

    this.subscriptions.push(sub);
  }

  fetchReceiptSettings() {
    const sub = this.receiptSettingService.fetchSettings().subscribe(settings => {
      this.default_currency = settings.default_currency;
    });

    this.subscriptions.push(sub);
  }

  hasDataAvailable() {
    return this.reportData && this.reportData.length > 0;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  exportToExcel(): void {

    Swal.fire(
      this.translate.instant('Exporting Report'),
      this.translate.instant('Please wait as report is exported') + '...',
      'info'
    );
    Swal.showLoading();

    this.excelService.generateExcel(this.formatMembersDataForExport(), 'report_data');
  }


  formatMembersDataForExport() {
    return this.reportData.map((row) => {
      return {
        membership_no: row.organisation_no,
        name: row.member_name,
        membership_category: row.membership_category_name,
        phone_number: row.mobile_number,
        contribution_type: row.contribution_type_name,
        last_contribution_date: row.last_contribution_date,
        avg_amount: row.avg_amount,
        total_amount: row.total_amount,
      }
    });
  }
}
