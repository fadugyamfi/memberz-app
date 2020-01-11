import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { OrganisationMemberCategory } from '../../model/cakeapi/organisation-member-category';
import { StorageService } from '../storage.service';
import { Organisation } from '../../model/cakeapi/organisation';

@Injectable({
  providedIn: 'root'
})
export class OrganisationMemberCategoryService extends APIService {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_member_categories';
    this.model =  OrganisationMemberCategory;
    this.model_name = 'OrganisationMemberCategory';
  }

  findCategories(options = {}, page = 1, limit = 15) {
    const params = Object.assign(options, {
      page,
      limit,
      sort: 'name:asc',
      active: 1
    });

    return this.search<OrganisationMemberCategory[]>(params);
  }
}
