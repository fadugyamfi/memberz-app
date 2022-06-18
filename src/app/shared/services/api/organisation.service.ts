import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { Organisation } from '../../model/api/organisation';
import { StorageService } from '../storage.service';
import { map, Observable, of, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService extends APIService<Organisation> {

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

  refreshActiveOrganisation() {
    const id = this.getActiveOrganisation().id;
    this.getById(id).subscribe((org: Organisation) => this.setActiveOrganisation(org));
  }

  getBySlug(slug: string, params = {}): Observable<Organisation> {
    const url = `/organisations/${slug}`;

    return this.get(url, params).pipe(map(res => new this.model(res['data'])));
  }

  getAllSlugs(params = {}): Observable<string[]> {
    if( this.storage.has('org_slugs') ) {
      return of( this.storage.get('org_slugs') );
    }

    const url = "/organisations/slugs";

    return this.get(url, params).pipe(
      tap((response) => {
        const slugs = response['data'];
        this.storage.set('org_slugs', slugs, 1, 'hours');
      }),
      map((response) => {
        return response['data'];
      }));
  }

  uploadLogo(organisation: Organisation, params = {}) {
    const url = `${this.BASE_URL}/organisations/${organisation.id}/logo`;

    return this.updateWithUpload(organisation, params, url);
  }
}
