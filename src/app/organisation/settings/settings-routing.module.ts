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


const routes: Routes = [
  {
    path: 'accounts',
    component: AdminAccountsComponent,
    data: {
      breadcrumb: 'Admin Accounts'
    }
  },
  {
    path: 'roles',
    component: RolesComponent,
    data: {
      breadcrumb: 'Roles & Permissions'
    }
  },
  {
    path: 'subscription',
    component: SubscriptionComponent,
    data: {
      breadcrumb: 'Subscription'
    }
  },
  {
    path: 'payment-platforms',
    component: PaymentPlatformsComponent,
    data: {
      breadcrumb: 'Payment Platforms'
    }
  },
  {
    path: 'subscription-renewal',
    component: SubscriptionRenewalComponent,
    data: {
      breadcrumb: 'Subscription Renewal'
    }
  },
  {
    path: 'subscription-upgrade',
    component: SubscriptionUpgradeComponent,
    data: {
      breadcrumb: 'Subscription Upgrade'
    }
  },
  {
    path: 'invoice-payment/:id',
    component: InvoicePaymentComponent,
    data: {
      breadcrumb: 'Invoice Payment'
    }
  },
  {
    path: 'process-payment',
    component: PaymentProcessorComponent,
    data: {
      breadcrumb: 'Processing Payment'
    }
  },
  {
    path: 'user-activities',
    component: UserActivitiesComponent,
    data: {
      breadcrumb: 'User Activities'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
