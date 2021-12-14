import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { IncomeComponent } from './income/income.component';
import { ReceiptsComponent } from './settings/receipts/receipts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncomeSourcesComponent } from './settings/income-sources/income-sources.component';
import { IncomeEditorComponent } from './income/income-editor/income-editor.component';
import { IncomeSummaryComponent } from './reports/income-summary/income-summary.component';
import { TopContributorsComponent } from './reports/top-contributors/top-contributors.component';
import { NonContributingMembersComponent } from './reports/non-contributing-members/non-contributing-members.component';
import { YearlySummaryReportComponent } from './reports/yearly-summary-report/yearly-summary-report.component';

@NgModule({
  declarations: [
    DashboardComponent,
    IncomeComponent,
    ReceiptsComponent,
    IncomeSourcesComponent,
    IncomeEditorComponent,
    IncomeSummaryComponent,
    TopContributorsComponent,
    NonContributingMembersComponent,
    YearlySummaryReportComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    SharedModule
  ],
})
export class FinanceModule { }
