import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Organisation } from '../../../shared/model/api/organisation';
import { SmsAccount } from '../../../shared/model/api/sms-account';
import { ContributionService } from '../../../shared/services/api/contribution.service';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationSubscriptionService } from '../../../shared/services/api/organisation-subscription.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { SmsAccountService } from '../../../shared/services/api/sms-account.service';
import * as chartData from './../../../shared/data/dashboard/university';
import { Configuration, ChartistModule } from 'ng-chartist';
import { NgClass, AsyncPipe } from '@angular/common';
import { FeatherIconsComponent } from '../../../shared/components/feather-icons/feather-icons.component';
import { CountToDirective } from '../../../shared/directives/count-to.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-general-statistics',
    templateUrl: './general-statistics.component.html',
    styleUrls: ['./general-statistics.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, FeatherIconsComponent, CountToDirective, ChartistModule, AsyncPipe, TranslateModule]
})
export class GeneralStatisticsComponent implements OnInit {

  public chart4 = chartData.chart4;
  public organisation: Organisation;
  public smsAccount: SmsAccount;
  public currentYear: number;

  public unapprovedMemberships$;
  public contributionSummary$;

  public configuration: Configuration = {
    type: chartData.chart4.type,
    data: chartData.chart4.data,
    options: chartData.chart4.options,
    responsiveOptions: chartData.chart4.responsiveOptions
  };

  constructor(
    public organisationService: OrganisationService,
    public orgSubscriptionService: OrganisationSubscriptionService,
    public smsAccountService: SmsAccountService,
    public membershipService: OrganisationMemberService,
    public contributionService: ContributionService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.organisation = this.organisationService.getActiveOrganisation();
    this.smsAccount = this.smsAccountService.getOrganisationAccount();

    this.fetchUnapprovedMemberships();
    this.fetchContributionSummary();
  }

  fetchUnapprovedMemberships() {
    this.unapprovedMemberships$ = this.membershipService.count({
      approved: 0
    });
  }

  fetchContributionSummary() {
    this.contributionSummary$ = this.contributionService.getSummary({ year: this.currentYear });
  }

  planStatusIndicator() {
    const showBorder =
       this.organisation.active_subscription?.isExpired() ||
       this.organisation.active_subscription?.isExpiring() ||
      ! this.organisation.active_subscription?.invoicePaid();

    return {
      'border-start': showBorder,
      'border-5': showBorder,
      'border-danger':  this.organisation.active_subscription?.isExpired(),
      'border-warning':  this.organisation.active_subscription?.isExpiring() || ! this.organisation.active_subscription?.invoicePaid()
    }
  }

  planStatusTextIndicator() {
    return {
      'text-danger':  this.organisation.active_subscription?.isExpired(),
      'text-warning':  this.organisation.active_subscription?.isExpiring() || ! this.organisation.active_subscription?.invoicePaid()
    }
  }

  subscriptionExpired() {
    return this.organisation?.active_subscription?.isExpired();
  }

  subscriptionExpiring() {
    return this.organisation?.active_subscription?.isExpiring();
  }

  subscriptionPaid() {
    return this.organisation?.active_subscription?.invoicePaid();
  }

  hasValidInvoice() {
    return this.organisation?.active_subscription?.organisation_invoice != null;
  }

  canUpgrade() {
    if (!this.organisation) {
      return false;
    }

    const subscription_type =  this.organisation.active_subscription?.subscription_type;
    if ( !subscription_type ) {
      return false;
    }

    return this.subscriptionPaid() && ['free', 'free2', 'sms_pro'].indexOf(subscription_type.name) > -1;
  }

  renewSubscription() {
    this.router.navigate(['/organisation/settings/subscription-renewal']);
  }

  upgradeSubscription() {
    this.router.navigate(['/organisation/settings/subscription-upgrade']);
  }

  paySubscription() {
    this.router.navigate(['/organisation/settings/invoice-payment',  this.organisation.active_subscription?.organisation_invoice.id]);
  }

}
