import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationPaymentPlatform } from '../../model/api/organisation-payment-platform';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationPaymentPlatformService extends APIService<OrganisationPaymentPlatform> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_payment_platforms';
    this.model =  OrganisationPaymentPlatform;
    this.model_name = 'OrganisationPaymentPlatform';
  }
}
