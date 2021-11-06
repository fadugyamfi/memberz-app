import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { IncomeComponent } from './income/income.component';
import { ReceiptsComponent } from './settings/receipts/receipts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncomeSourcesComponent } from './settings/income-sources/income-sources.component';
import { IncomeEditorComponent } from './income/income-editor/income-editor.component';

@NgModule({
  declarations: [
    DashboardComponent,
    IncomeComponent,
    ReceiptsComponent,
    IncomeSourcesComponent,
    IncomeEditorComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    SharedModule
  ],
})
export class FinanceModule { }
