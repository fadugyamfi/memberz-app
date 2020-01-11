import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { MembershipsModule } from './memberships/memberships.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SubscriptionStatusComponent } from './dashboard/subscription-status/subscription-status.component';


@NgModule({
  declarations: [DashboardComponent, SubscriptionStatusComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrganisationRoutingModule,
    MembershipsModule,
    NgbModule,
    ChartistModule,
    ChartsModule,
    NgxChartsModule,
  ]
})
export class OrganisationModule { }
