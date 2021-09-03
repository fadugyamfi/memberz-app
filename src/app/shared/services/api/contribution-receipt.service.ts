import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { ContributionReceipt } from '../../model/api/contribution-receipt';

@Injectable({
  providedIn: 'root'
})
export class ContributionReceiptService extends APIService<ContributionReceipt> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/contribution-receipts';
    this.model =  ContributionReceipt;
    this.model_name = 'ContributionReceipt';
  }

}
