import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: 'memberships',
        loadChildren: () => import('./memberships/memberships.module').then(m => m.MembershipsModule),
        data: {
          breadcrumb: 'Memberships'
        }
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        data: {
          breadcrumb: 'Settings'
        }
      },
      {
        path: 'messaging',
        loadChildren: () => import('./messaging/messaging.module').then(m => m.MessagingModule),
        data: {
          breadcrumb: 'Messaging'
        }
      },
      {
        path: 'finance',
        loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule),
        data: {
          breadcrumb: 'Finance'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule { }
