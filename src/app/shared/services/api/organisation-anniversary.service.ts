import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
 import { OrganisationAnniversary } from '../../model/api/organisation-anniversary';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationAnniversaryService extends APIService<OrganisationAnniversary> {


  constructor(http: HttpClient,protected events: EventsService, protected storage: StorageService) {
    super(http,events,storage);

    this.url = '/organisation_anniversaries';
    this.model = OrganisationAnniversary;
    this.model_name = 'OrganisationAnniversary';
  }
}
