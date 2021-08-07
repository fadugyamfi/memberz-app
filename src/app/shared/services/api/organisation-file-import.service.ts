import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationFileImport } from '../../model/api/organisation-file-import';
import { StorageService } from '../storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganisationFileImportService extends APIService<OrganisationFileImport> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_file_imports';
    this.model = OrganisationFileImport;
    this.model_name = 'OrganisationFileImport';
  }
}
