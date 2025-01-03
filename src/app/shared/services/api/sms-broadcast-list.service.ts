import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SmsBroadcastList } from '../../model/api/sms-broadcast-list';

@Injectable({
  providedIn: 'root'
})
export class SmsBroadcastListService extends APIService<SmsBroadcastList> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/sms_broadcast_lists';
    this.model = SmsBroadcastList;
    this.model_name = 'SmsBroadcastList';
  }

  getFilters() {
    return this.get(`${this.url}/filters`);
  }

  getListPreview(broadcastList: SmsBroadcastList) {
    return this.get(`${this.url}/preview/${broadcastList.id}`);
  }
}
