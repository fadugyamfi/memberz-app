import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { AdminAccountsComponent } from './admin-accounts/admin-accounts.component';
import { SharedModule } from '../../shared/shared.module';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentPlatformsComponent } from './payment-platforms/payment-platforms.component';
import { SubscriptionRenewalComponent } from './subscription-renewal/subscription-renewal.component';
import { SubscriptionUpgradeComponent } from './subscription-upgrade/subscription-upgrade.component';
import { InvoicePaymentComponent } from './invoice-payment/invoice-payment.component';
import { PaymentProcessorComponent } from './payment-processor/payment-processor.component';


@NgModule({
  declarations: [
    AdminAccountsComponent,
    RolesComponent,
    PermissionsComponent,
    SubscriptionComponent,
    PaymentPlatformsComponent,
    SubscriptionRenewalComponent,
    SubscriptionUpgradeComponent,
    InvoicePaymentComponent,
    PaymentProcessorComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
