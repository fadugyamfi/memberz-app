import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SmsAccountService } from '../shared/services/api/sms-account.service';
import { MembershipOverviewComponent } from './dashboard/membership-overview/membership-overview.component';
import { RecentlyUpdatedComponent } from './dashboard/recently-updated/recently-updated.component';
import { GeneralStatisticsComponent } from './dashboard/general-statistics/general-statistics.component';
import { ChartistModule } from 'ng-chartist';


@NgModule({
  declarations: [
    DashboardComponent,
    MembershipOverviewComponent,
    RecentlyUpdatedComponent,
    GeneralStatisticsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChartistModule,
    OrganisationRoutingModule
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
