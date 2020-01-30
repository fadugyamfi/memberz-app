import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAccountsComponent } from './admin-accounts/admin-accounts.component';
import { RolesComponent } from './roles/roles.component';
import { PaymentPlatformsComponent } from './payment-platforms/payment-platforms.component';
import { SubscriptionComponent } from './subscription/subscription.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
