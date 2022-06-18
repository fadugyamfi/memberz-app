import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAccountsComponent } from './admin-accounts/admin-accounts.component';
import { RolesComponent } from './roles/roles.component';
import { PaymentPlatformsComponent } from './payment-platforms/payment-platforms.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscriptionRenewalComponent } from './subscription-renewal/subscription-renewal.component';
import { SubscriptionUpgradeComponent } from './subscription-upgrade/subscription-upgrade.component';
import { InvoicePaymentComponent } from './invoice-payment/invoice-payment.component';
import { PaymentProcessorComponent } from './payment-processor/payment-processor.component';
import { UserActivitiesComponent } from './user-activities/user-activities.component';
import { ProSubscriptionRequiredComponent } from './pro-subscription-required/pro-subscription-required.component';


const routes: Routes = [
  {
    path: 'accounts',
    component: AdminAccountsComponent,
    data: {
      title: 'Admin Accounts',
      breadcrumb: 'Admin Accounts'
    }
  },
  {
    path: 'roles',
    component: RolesComponent,
    data: {
      title: 'Roles & Permissions',
      breadcrumb: 'Roles & Permissions'
    }
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    data: {
      title: 'Subscription',
      breadcrumb: 'Subscription'
    }
  },
  {
    path: 'payment-platforms',
    component: PaymentPlatformsComponent,
    data: {
      title: 'Payment Platforms',
      breadcrumb: 'Payment Platforms'
    }
  },
  {
    path: 'subscription-renewal',
    component: SubscriptionRenewalComponent,
    data: {
      title: 'Subscription Renewal',
      breadcrumb: 'Subscription Renewal'
    }
  },
  {
    path: 'subscription-upgrade',
    component: SubscriptionUpgradeComponent,
    data: {
      title: 'Subscription Upgrade',
      breadcrumb: 'Subscription Upgrade'
    }
  },
  {
    path: 'invoice-payment/:id',
    component: InvoicePaymentComponent,
    data: {
      title: 'Invoice Payment',
      breadcrumb: 'Invoice Payment'
    }
  },
  {
    path: 'process-payment',
    component: PaymentProcessorComponent,
    data: {
      title: 'Processing Payment',
      breadcrumb: 'Processing Payment'
    }
  },
  {
    path: 'user-activities',
    component: UserActivitiesComponent,
    data: {
      title: 'User Activities',
      breadcrumb: 'User Activities'
    }
  },
  {
    path: 'pro-subscription-required',
    component: ProSubscriptionRequiredComponent,
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
