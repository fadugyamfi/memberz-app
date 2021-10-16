import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { ChartsModule } from 'ng2-charts';
import { IncomeComponent } from './income/income.component';
import { SelectMonthControlComponent } from 'src/app/shared/components/forms/select-month-control/select-month-control.component';
import { SelectYearControlComponent } from 'src/app/shared/components/forms/select-year-control/select-year-control.component';
import { ReceiptsComponent } from './settings/receipts/receipts.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    IncomeComponent,
    SelectMonthControlComponent,
    SelectYearControlComponent,
    ReceiptsComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    SharedModule,
    ChartsModule
  ],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FinanceModule { }
