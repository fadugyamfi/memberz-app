import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { OrganisationMember } from '../../model/cakeapi/organisation-member';
import { StorageService } from '../storage.service';
import { OrganisationService } from './organisation.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationMemberService extends APIService {

  constructor(
    protected http: HttpClient,
    protected events: EventsService,
    protected storage: StorageService,
    protected organisationService: OrganisationService
  ) {
    super(http, events, storage);

    this.url = '/organisation_members';
    this.model =  OrganisationMember;
    this.model_name = 'OrganisationMember';
  }

  findMembers(options: object, page = 1, limit = 30) {
    const params = Object.assign(options, {
      page,
      limit,
      sort: 'last_name:asc'
    });

    return this.search(params);
  }

  getProfile(id: number) {
    const params = {};

    return this.getById(id, params);
  }

  approveRegistration(membership: OrganisationMember) {
    membership.approved = 1;
    membership.active = 1;

    return this.update(membership);
  }

  rejectRegistration(membership: OrganisationMember) {
    membership.approved = 0;
    membership.active = 0;

    return this.update(membership);
  }

  statistics() {
    const organisation = this.organisationService.getActiveOrganisation();

    return this.get(`/organisations/${organisation.id}/memberships/statistics`).pipe(map(response => {
      return response['data'].map(result => {
        return { value: result.total, name: result.category_name };
      });
    }));
  }

  unapproved() {
    return this.get(`${this.url}/unapproved`).pipe(map(response => {
      return response['data'].map(result => new OrganisationMember(result));
    }));
  }
}
