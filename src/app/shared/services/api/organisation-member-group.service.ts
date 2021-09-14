import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationMemberGroup } from '../../model/api/organisation-member-group';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationMemberGroupService extends APIService<OrganisationMemberGroup> {

  constructor(http: HttpClient,protected events: EventsService, protected storage: StorageService) {
    super(http,events,storage);

    this.url = '/organisation_member_groups';
    this.model = OrganisationMemberGroup;
    this.model_name = 'OrganisationMemberGroup';
  }
}
