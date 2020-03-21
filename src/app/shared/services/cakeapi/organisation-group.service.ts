import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationGroup } from '../../model/cakeapi/organisation-group';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationGroupService extends APIService{

  constructor(http: HttpClient,protected events: EventsService, protected storage: StorageService) { 
    super(http,events,storage);
    
    this.url = '/organisation_groups';
    this.model = OrganisationGroup;
    this.model_name = 'OrganisationGroup';
  }
}


