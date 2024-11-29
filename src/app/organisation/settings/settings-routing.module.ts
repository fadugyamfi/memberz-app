import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';












const routes: Routes = [
  {
    path: 'accounts',
    loadComponent: () => import('./admin-accounts/admin-accounts.component').then(m => m.AdminAccountsComponent),
    data: {
      title: 'Admin Accounts',
      breadcrumb: 'Admin Accounts'
    }
  },
  {
    path: 'roles',
    loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent),
    data: {
      title: 'Roles & Permissions',
      breadcrumb: 'Roles & Permissions'
    }
  },
  {
    path: 'subscription',
    loadComponent: () => import('./subscription/subscription.component').then(m => m.SubscriptionComponent),
    data: {
      title: 'Subscription',
      breadcrumb: 'Subscription'
    }
  },
  {
    path: 'payment-platforms',
    loadComponent: () => import('./payment-platforms/payment-platforms.component').then(m => m.PaymentPlatformsComponent),
    data: {
      title: 'Payment Platforms',
      breadcrumb: 'Payment Platforms'
    }
  },
  {
    path: 'subscription-renewal',
    loadComponent: () => import('./subscription-renewal/subscription-renewal.component').then(m => m.SubscriptionRenewalComponent),
    data: {
      title: 'Subscription Renewal',
      breadcrumb: 'Subscription Renewal'
    }
  },
  {
    path: 'subscription-upgrade',
    loadComponent: () => import('./subscription-upgrade/subscription-upgrade.component').then(m => m.SubscriptionUpgradeComponent),
    data: {
      title: 'Subscription Upgrade',
      breadcrumb: 'Subscription Upgrade'
    }
  },
  {
    path: 'invoice-payment/:id',
    loadComponent: () => import('./invoice-payment/invoice-payment.component').then(m => m.InvoicePaymentComponent),
    data: {
      title: 'Invoice Payment',
      breadcrumb: 'Invoice Payment'
    }
  },
  {
    path: 'process-payment',
    loadComponent: () => import('./payment-processor/payment-processor.component').then(m => m.PaymentProcessorComponent),
    data: {
      title: 'Processing Payment',
      breadcrumb: 'Processing Payment'
    }
  },
  {
    path: 'user-activities',
    loadComponent: () => import('./user-activities/user-activities.component').then(m => m.UserActivitiesComponent),
    data: {
      title: 'User Activities',
      breadcrumb: 'User Activities'
    }
  },
  {
    path: 'pro-subscription-required',
    loadComponent: () => import('./pro-subscription-required/pro-subscription-required.component').then(m => m.ProSubscriptionRequiredComponent),
    data: {
      title: 'Pro Plan Subscription Required',
      breadcrumb: 'Pro Plan Subscription Required'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
