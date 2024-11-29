import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: 'Finance Dashboard',
      breadcrumb: 'Dashboard'
    }
  },
  {
    path: 'income',
    loadComponent: () => import('./income/income.component').then(m => m.IncomeComponent),
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
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    data: {
      title: 'Reports',
      breadcrumb: 'Reports'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
