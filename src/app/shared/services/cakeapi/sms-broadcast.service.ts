import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SmsBroadcast } from '../../model/cakeapi/sms-broadcast';

@Injectable({
  providedIn: 'root'
})
export class SmsBroadcastService extends APIService {


  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/sms_broadcasts';
    this.model = SmsBroadcast;
    this.model_name = 'SmsBroadcast';
  }
}
