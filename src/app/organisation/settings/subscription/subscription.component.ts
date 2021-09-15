import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { OrganisationSubscriptionService } from '../../../shared/services/api/organisation-subscription.service';
import { OrganisationSubscription } from '../../../shared/model/api/organisation-subscription';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy {

  public history: OrganisationSubscription[];
  public subs: Subscription[] = [];

  constructor(
    public events: EventsService,
    public subscriptionService: OrganisationSubscriptionService
  ) { }

  ngOnInit() {
    this.loadSubscriptionHistory();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  loadSubscriptionHistory(page = 1, limit = 6) {
    this.history = [];

    const sub = this.subscriptionService.getAll({
      contain: ['organisation_invoice.transaction_type', 'organisation_invoice.currency'].join(),
      sort: 'id:desc',
      page,
      limit
    }).subscribe(
      (history) => this.history = history
    );

    this.subs.push(sub);
  }

  onPaginate(event: PageEvent) {
    this.loadSubscriptionHistory(event.page, event.limit);
  }
}
