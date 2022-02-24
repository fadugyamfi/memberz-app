import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { PaymentPlatform } from '../../model/api/payment-platform';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentPlatformService extends APIService<PaymentPlatform> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/payment_platforms';
    this.model =  PaymentPlatform;
    this.model_name = 'PaymentPlatform';
  }
}
