import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Organisation } from '../../../shared/model/cakeapi/organisation';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';
import { OrganisationSubscriptionService } from '../../services/cakeapi/organisation-subscription.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-status',
  templateUrl: './subscription-status.component.html',
  styleUrls: ['./subscription-status.component.scss']
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
    return this.organisation.active_subscription.isExpired();
  }

  subscriptionPaid() {
    return this.organisation.active_subscription.organisation_invoice != null &&
           this.organisation.active_subscription.organisation_invoice.paid;
  }

  hasValidInvoice() {
    return this.organisation.active_subscription.organisation_invoice != null;
  }

  renewSubscription() {
    this.router.navigate(['/organisation/settings/subscription-renewal']);
  }

  upgradeSubscription() {
    this.router.navigate(['/organisation/settings/subscription-upgrade']);
  }
}
