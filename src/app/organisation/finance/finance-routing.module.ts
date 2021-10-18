import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: 'income',
    component: IncomeComponent,
    data: {
      title: 'Income',
      breadcrumb: 'Income'
    }
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    data: {
      title: 'Settings',
      breadcrumb: 'Settings'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
