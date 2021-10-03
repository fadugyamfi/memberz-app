import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationMemberImport } from '../../model/api/organisation-Member-import';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationMemberImportService extends APIService<OrganisationMemberImport> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_member_imports';
    this.model = OrganisationMemberImport;
    this.model_name = 'OrganisationMemberImport';
  }
}
