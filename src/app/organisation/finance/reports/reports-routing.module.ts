import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';






const routes: Routes = [
  {
    path: 'income-summary',
    loadComponent: () => import('./income-summary/income-summary.component').then(m => m.IncomeSummaryComponent),
    data: {
      title: 'Income Summary',
      breadcrumb: 'Income Summary'
    }
  },
  {
    path: 'yearly-summary',
    loadComponent: () => import('./yearly-summary-report/yearly-summary-report.component').then(m => m.YearlySummaryReportComponent),
    data: {
      title: 'Yearly Summary',
      breadcrumb: 'Yearly Summary'
    }
  },
  {
    path: 'top-contributors',
    loadComponent: () => import('./top-contributors/top-contributors.component').then(m => m.TopContributorsComponent),
    data: {
      title: 'Top Contributors',
      breadcrumb: 'Top Contributors'
    }
  },
  {
    path: 'non-contributing-members',
    loadComponent: () => import('./non-contributing-members/non-contributing-members.component').then(m => m.NonContributingMembersComponent),
    data: {
      title: 'Non Contributing Members',
      breadcrumb: 'Non Contributing Members'
    }
  },
  {
    path: 'contributors-by-type',
    loadComponent: () => import('./contributors-by-type/contributors-by-type.component').then(m => m.ContributorsByTypeComponent),
    data: {
      title: 'Contributors By Type',
      breadcrumb: 'Contributors By Type'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
