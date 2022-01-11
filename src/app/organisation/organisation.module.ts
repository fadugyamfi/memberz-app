import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SmsAccountService } from '../shared/services/api/sms-account.service';
import { MembershipOverviewComponent } from './dashboard/membership-overview/membership-overview.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MembershipOverviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrganisationRoutingModule,
    NgbModule
  ]
})
export class OrganisationModule {

  public constructor(
    private accountService: SmsAccountService
  ) {
    if ( !this.accountService.hasOrganisationAccount() ) {
      this.accountService.refreshAccount();
    }
  }
}
