import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { OrganisationRegistrationForm } from '../../model/api/organisation-registration-form';
import { map } from 'rxjs';

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

  getBySlugs(org_slug: string, slug: string, params = {}, headers = {}) {
    const url = `/organisations/${org_slug}/organisation_registration_forms/${slug}`;

    return this.get(url, params, headers).pipe(map(res => new this.model(res['data'])));
  }
}
