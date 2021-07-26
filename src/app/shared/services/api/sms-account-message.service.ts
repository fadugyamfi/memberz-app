import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SmsAccountMessage } from '../../model/api/sms-account-message';

@Injectable({
  providedIn: 'root'
})
export class SmsAccountMessageService extends APIService {


  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/sms_account_messages';
    this.model = SmsAccountMessage;
    this.model_name = 'SmsAccountMessage';
  }
}
