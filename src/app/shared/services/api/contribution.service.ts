import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { Contribution } from '../../model/api/contribution';
import { map, tap } from 'rxjs/operators';
import { OrganisationService } from './organisation.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributionService extends APIService<Contribution> {

  constructor(
    protected http: HttpClient,
    protected events: EventsService,
    protected storage: StorageService,
    protected orgSerivce: OrganisationService
  ) {
    super(http, events, storage);

    this.url = '/contributions';
    this.model =  Contribution;
    this.model_name = 'Contribution';
  }

  getAvailableYears() {
    const org = this.orgSerivce.getActiveOrganisation();
    const cacheKey = `available_years_${org.id}`;

    if ( this.storage.has(cacheKey) ) {
      return of(this.storage.get(cacheKey));
    }

    return this.get(`${this.url}/available_years`).pipe(
      map((res) => {
        const years = Object.values(res);
        const currentYear = (new Date()).getFullYear();
        if ( !years.includes(currentYear) ) {
          years.unshift(currentYear);
        }
        return years;
      }),

      tap((res) => {
        this.storage.set(cacheKey, res, 1, 'hours');
      })
    );
  }

}
