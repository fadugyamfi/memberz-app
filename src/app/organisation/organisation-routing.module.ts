import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProSubscriptionGuard } from '../shared/guard/pro-subscription.guard';
import { ActiveSubscriptionGuard } from '../shared/guard/active-subscription.guard';
import { FinanceFeaturesGuard } from '../shared/guard/finance-features.guard';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: {
          breadcrumb: 'Dashboard',
          title: "Organisation Dashboard"
        }
      },
      {
        path: 'memberships',
        loadChildren: () => import('./memberships/memberships.module').then(m => m.MembershipsModule),
        canActivate: [ActiveSubscriptionGuard],
        data: {
          breadcrumb: 'Memberships'
        }
      },
      {
        path: 'messaging',
        loadChildren: () => import('./messaging/messaging.module').then(m => m.MessagingModule),
        canActivate: [ActiveSubscriptionGuard],
        data: {
          breadcrumb: 'Messaging'
        }
      },
      {
        path: 'finance',
        loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule),
        canActivate: [FinanceFeaturesGuard, ActiveSubscriptionGuard],
        data: {
          breadcrumb: 'Finance'
        }
      },
      {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
        canActivate: [ActiveSubscriptionGuard],
        data: {
          breadcrumb: 'Events'
        }
      },
      {
        path: 'branches',
        loadChildren: () => import('./branches/branches.module').then(m => m.BranchesModule),
        canActivate: [ActiveSubscriptionGuard],
        data: {
          breadcrumb: 'Branches'
        }
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        data: {
          breadcrumb: 'Settings'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule { }
