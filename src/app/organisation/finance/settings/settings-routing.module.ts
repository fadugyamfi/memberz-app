import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeSourcesComponent } from './income-sources/income-sources.component';
import { ReceiptsComponent } from './receipts/receipts.component';

const routes: Routes = [
  {
    path: 'receipts',
    component: ReceiptsComponent,
    data: {
      breadcrumb: 'Receipts'
    }
  },
  {
    path: 'income-sources',
    component: IncomeSourcesComponent,
    data: {
      breadcrumb: 'Income Sources'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
