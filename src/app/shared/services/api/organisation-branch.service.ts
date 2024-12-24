import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationBranch } from '../../model/api/organisation-branch';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationBranchService extends APIService<OrganisationBranch> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_branches';
    this.model =  OrganisationBranch;
    this.model_name = 'OrganisationBranch';
  }

}
