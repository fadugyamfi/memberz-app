import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
 import { OrganisationGroupType } from '../../model/api/orgainsation-group-type';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationGroupTypeService extends APIService<OrganisationGroupType> {


  constructor(http: HttpClient,protected events: EventsService, protected storage: StorageService) {
    super(http,events,storage);

    this.url = '/organisation_group_types';
    this.model = OrganisationGroupType;
    this.model_name = 'OrganisationGroupType';
  }
}
