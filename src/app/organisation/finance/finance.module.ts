import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { ChartsModule } from 'ng2-charts';
import { IncomeComponent } from './income/income.component';

@NgModule({
  declarations: [
    DashboardComponent,
    IncomeComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    ChartsModule
  ]
})
export class FinanceModule { }
