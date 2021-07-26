import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { SubscriptionType } from '../../model/api/subscription-type';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionTypeService extends APIService {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/subscription_types';
    this.model =  SubscriptionType;
    this.model_name = 'SubscriptionType';
  }

  getTypesUpradeableFrom(subscription_type_id: number) {
    return this.getAll<SubscriptionType[]>({
      active: 1,
      promotional: 0,
      id_notIn: subscription_type_id
    });
  }
}
