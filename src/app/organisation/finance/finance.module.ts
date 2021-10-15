import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { ChartsModule } from 'ng2-charts';
import { IncomeComponent } from './income/income.component';
import { SelectMonthControlComponent } from 'src/app/shared/components/forms/select-month-control/select-month-control.component';

@NgModule({
  declarations: [
    DashboardComponent,
    IncomeComponent,
    SelectMonthControlComponent,
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    ChartsModule
  ],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FinanceModule { }
