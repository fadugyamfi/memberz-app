import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationEventSession } from '../../model/api/organisation-event-session';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationEventSessionService extends APIService<OrganisationEventSession> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/event_sessions';
    this.model =  OrganisationEventSession;
    this.model_name = 'OrganisationEventSession';
  }

}
