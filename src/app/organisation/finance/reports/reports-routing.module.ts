import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeSummaryComponent } from './income-summary/income-summary.component';
import { TopContributorsComponent } from './top-contributors/top-contributors.component';
import { NonContributingMembersComponent } from './non-contributing-members/non-contributing-members.component';
import { YearlySummaryReportComponent } from './yearly-summary-report/yearly-summary-report.component';

const routes: Routes = [
  {
    path: 'income-summary',
    component: IncomeSummaryComponent,
    data: {
      title: 'Income Summary',
      breadcrumb: 'Income Summary'
    }
  },
  {
    path: 'yearly-summary',
    component: YearlySummaryReportComponent,
    data: {
      title: 'Yearly Summary',
      breadcrumb: 'Yearly Summary'
    }
  },
  {
    path: 'top-contributors',
    component: TopContributorsComponent,
    data: {
      title: 'Top Contributors',
      breadcrumb: 'Top Contributors'
    }
  },
  {
    path: 'non-contributing-members',
    component: NonContributingMembersComponent,
    data: {
      title: 'Non Contributing Members',
      breadcrumb: 'Non Contributing Members'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
