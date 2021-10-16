import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { ChartsModule } from 'ng2-charts';
import { IncomeComponent } from './income/income.component';
import { ReceiptsComponent } from './settings/receipts/receipts.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    IncomeComponent,
    ReceiptsComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    SharedModule,
    ChartsModule
  ],
})
export class FinanceModule { }
