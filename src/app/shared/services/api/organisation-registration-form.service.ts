import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { OrganisationRegistrationForm } from '../../model/api/organisation-registration-form';

@Injectable({
  providedIn: 'root'
})
export class OrganisationRegistrationFormService extends APIService<OrganisationRegistrationForm> {


  constructor(http: HttpClient,protected events: EventsService, protected storage: StorageService) {
    super(http,events,storage);

    this.url = '/organisation_registration_forms';
    this.model = OrganisationRegistrationForm;
    this.model_name = 'OrganisationRegistrationForm';
  }
}
