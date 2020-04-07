import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SmsCredit } from '../../model/cakeapi/sms-credit';

@Injectable({
  providedIn: 'root'
})
export class SmsCreditService extends APIService {


  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/sms_account_messages';
    this.model = SmsCredit;
    this.model_name = 'SmsCredit';
  }
}
