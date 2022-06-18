import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProSubscriptionGuard } from '../shared/guard/pro-subscription.guard';
import { ActiveSubscriptionGuard } from '../shared/guard/active-subscription.guard';
import { FinanceFeaturesGuard } from '../shared/guard/finance-features.guard';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
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
