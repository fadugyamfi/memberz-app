import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationMemberAnniversary } from '../../model/api/organisation-member-anniversary';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationMemberAnniversaryService extends APIService<OrganisationMemberAnniversary> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_member_anniversaries';
    this.model =  OrganisationMemberAnniversary;
    this.model_name = 'OrganisationMemberAnniversary';
  }
}
