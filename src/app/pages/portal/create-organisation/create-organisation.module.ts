import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateOrganisationRoutingModule } from './create-organisation-routing.module';
import { CreateOrganisationComponent } from './create-organisation.component';

import { SubscriptionComponent } from './subscription/subscription.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { ReviewComponent } from './review/review.component';
import { SharedModule } from '../../../shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

// import { ArchwizardModule } from 'angular-archwizard';


@NgModule({
  declarations: [
    CreateOrganisationComponent,
    SubscriptionComponent,
    ProfileComponent,
    PaymentComponent,
    ReviewComponent
  ],
  imports: [
    CommonModule,
    CreateOrganisationRoutingModule,
    SharedModule,
    NgxIntlTelInputModule,
    // ArchwizardModule
  ]
})
export class CreateOrganisationModule { }
