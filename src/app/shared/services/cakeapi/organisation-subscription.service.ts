import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationSubscription } from '../../model/cakeapi/organisation-subscription';
import { StorageService } from '../storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganisationSubscriptionService extends APIService {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_subscriptions';
    this.model =  OrganisationSubscription;
    this.model_name = 'OrganisationSubscription';
  }

  renew(subscription_type_id: number, length: number) {
    const params = { length };

    return this.post(`${this.url}/${subscription_type_id}/renew`, params).pipe(map(res => {
      return new OrganisationSubscription(res['data']);
    }));
  }

  upgrade(subscription: OrganisationSubscription, newSubscriptionId: number, length: number) {
    const params = {
      subscription_type_id: newSubscriptionId,
      length: length
    };

    return this.post(`${this.url}/${subscription.id}/upgrade`, params).pipe(map(res => {
      return new OrganisationSubscription(res['data']);
    }));
  }
}
