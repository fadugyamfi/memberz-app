import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Organisation } from '../../model/cakeapi/organisation';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService extends APIService {

  public activeOrganisation: Organisation;
  private ACTIVE_ORG_CACHE_KEY = 'active_organsation';

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisations';
    this.model = Organisation;
    this.model_name = 'Organisation';
  }

  /**
   * Returns the active organisation being managed
   */
  public getActiveOrganisation(): Organisation {
    if (!this.activeOrganisation && this.storage.has(this.ACTIVE_ORG_CACHE_KEY)) {
      this.activeOrganisation = new Organisation(this.storage.get(this.ACTIVE_ORG_CACHE_KEY));
    }

    return this.activeOrganisation;
  }

  /**
   * Sets the active organisation being managed
   *
   * @param org Organisation to manage
   */
  public setActiveOrganisation(org: Organisation) {
    this.activeOrganisation = org;
    this.storage.set(this.ACTIVE_ORG_CACHE_KEY, org, 1, 'days');
    this.events.trigger('active:organisation:set', this.activeOrganisation);
  }

  public clearActiveOrganisation() {
    this.activeOrganisation = null;
    this.storage.remove(this.ACTIVE_ORG_CACHE_KEY);
    this.events.trigger('active:organisation:cleared');
  }

  // findMembers(options: object, page = 1, limit = 30) {
  //   const params = Object.assign(options, {
  //     contain: ['member'].join(),
  //     page,
  //     limit
  //   });

  //   return this.get(`${this.url}`, params).pipe(map(res => {
  //     return res['data'].map(data => new Organisation(data));
  //   }));
  // }
}
