import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationCalendar } from '../../model/api/organisation-calendar';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationCalendarService extends APIService<OrganisationCalendar> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/calendars';
    this.model =  OrganisationCalendar;
    this.model_name = 'OrganisationCalendar';
  }

}
