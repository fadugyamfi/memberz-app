import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Organisation } from '../../model/api/organisation';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { OrganisationSubscriptionService } from '../../services/api/organisation-subscription.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-subscription-status',
    templateUrl: './subscription-status.component.html',
    styleUrls: ['./subscription-status.component.scss'],
    standalone: true,
    imports: [NgIf, TranslateModule]
})
export class SubscriptionStatusComponent implements OnInit, OnDestroy {

  public organisation: Organisation;
  public subs: Subscription[] = [];

  constructor(
    public events: EventsService,
    public storage: StorageService,
    public organisationService: OrganisationService,
    public orgSubscriptionService: OrganisationSubscriptionService,
    public router: Router
  ) { }

  ngOnInit() {
    this.organisation = this.organisationService.getActiveOrganisation();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  subscriptionExpired() {
    return this.organisation?.active_subscription.isExpired();
  }

  subscriptionExpiring() {
    return this.organisation?.active_subscription.isExpiring();
  }

  subscriptionPaid() {
    return this.organisation?.active_subscription.invoicePaid();
  }

  hasValidInvoice() {
    return this.organisation?.active_subscription.organisation_invoice != null;
  }

  renewSubscription() {
    this.router.navigate(['/organisation/settings/subscription-renewal']);
  }

  upgradeSubscription() {
    this.router.navigate(['/organisation/settings/subscription-upgrade']);
  }

  paySubscription() {
    this.router.navigate(['/organisation/settings/invoice-payment', this.organisation.active_subscription.organisation_invoice.id]);
  }

  canUpgrade() {
    if (!this.organisation) {
      return false;
    }

    const subscription_type = this.organisation.active_subscription.subscription_type;
    if ( !subscription_type ) {
      return false;
    }

    return this.subscriptionPaid() && ['free', 'free2', 'sms_pro'].indexOf(subscription_type.name) > -1;
  }
}
