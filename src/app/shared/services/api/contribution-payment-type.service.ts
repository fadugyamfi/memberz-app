import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { ContributionPaymentType } from '../../model/api/contribution-payment-type';

@Injectable({
  providedIn: 'root'
})
export class ContributionPaymentTypeService extends APIService<ContributionPaymentType> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/contribution_payment_types';
    this.model =  ContributionPaymentType;
    this.model_name = 'ContributionPaymentType';
  }

}
