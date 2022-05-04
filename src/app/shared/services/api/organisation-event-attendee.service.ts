import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationEventAttendee } from '../../model/api/organisation-event-attendee';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationEventAttendeeService extends APIService<OrganisationEventAttendee> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/event_attendees';
    this.model =  OrganisationEventAttendee;
    this.model_name = 'OrganisationEventAttendee';
  }

}
