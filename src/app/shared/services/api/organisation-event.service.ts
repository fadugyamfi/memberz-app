import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationEvent } from '../../model/api/organisation-event';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationEventService extends APIService<OrganisationEvent> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/events';
    this.model =  OrganisationEvent;
    this.model_name = 'OrganisationEvent';
  }

}
