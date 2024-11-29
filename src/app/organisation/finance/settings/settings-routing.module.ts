import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'receipts',
    loadComponent: () => import('./receipts/receipts.component').then(m => m.ReceiptsComponent),
    data: {
      title: 'Receipts',
      breadcrumb: 'Receipts'
    }
  },
  {
    path: 'income-sources',
    loadComponent: () => import('./income-sources/income-sources.component').then(m => m.IncomeSourcesComponent),
    data: {
      title: 'Income Sources',
      breadcrumb: 'Income Sources'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
