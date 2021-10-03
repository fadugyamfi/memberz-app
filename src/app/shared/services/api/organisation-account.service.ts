import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationAccount } from '../../model/api/organisation-account';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationAccountService extends APIService<OrganisationAccount> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_accounts';
    this.model =  OrganisationAccount;
    this.model_name = 'OrganisationAccount';
  }

}
