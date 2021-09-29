import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationSubscription } from '../../model/api/organisation-subscription';
import { StorageService } from '../storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganisationSubscriptionService extends APIService<OrganisationSubscription> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_subscriptions';
    this.model = OrganisationSubscription;
    this.model_name = 'OrganisationSubscription';
  }

  renew(organisation_id: number, organisationSubscriptionId: number, length: number) {
    const params = { organisation_id, length };
    const qparams = {
      contain: [
        'organisation_invoice.transaction_type',
        'organisation_invoice.organisation_invoice_items'
      ].join()
    };

    return this.post(`${this.url}/${organisationSubscriptionId}/renew`, params, qparams).pipe(map(res => {
      return new OrganisationSubscription(res['data']);
    }));
  }

  upgrade(organisation_id: number, organisationSubscriptionId: number, newSubscriptionTypeId: number, length: number) {
    const params = {
      subscription_type_id: newSubscriptionTypeId,
      organisation_id,
      length
    };

    const qparams = {
      contain: [
        'organisation_invoice.transaction_type',
        'organisation_invoice.organisation_invoice_items'
      ].join()
    };

    return this.post(`${this.url}/${organisationSubscriptionId}/upgrade`, params, qparams).pipe(map(res => {
      return new OrganisationSubscription(res['data']);
    }));
  }
}
