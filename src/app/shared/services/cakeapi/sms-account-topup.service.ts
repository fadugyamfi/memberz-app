import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SmsAccountTopup } from '../../model/cakeapi/sms-account-topup';

@Injectable({
  providedIn: 'root'
})
export class SmsAccountTopupService extends APIService {


  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/sms_account_topups';
    this.model = SmsAccountTopup;
    this.model_name = 'SmsAccountTopup';
  }
}
