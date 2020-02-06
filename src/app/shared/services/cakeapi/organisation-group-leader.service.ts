import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationGroupLeader } from '../../model/cakeapi/organisation-group-leader';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationGroupLeaderService extends APIService{

 
  constructor(http: HttpClient,protected events: EventsService, protected storage: StorageService) { 
    super(http,events,storage);
    
    this.url = '/organisation_group_leaders';
    this.model = OrganisationGroupLeader;
    this.model_name = 'OrganisationGroupLeader';
  }
}
