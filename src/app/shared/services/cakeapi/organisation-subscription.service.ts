import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationSubscription } from '../../model/cakeapi/organisation-subscription';
import { StorageService } from '../storage.service';

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

}
