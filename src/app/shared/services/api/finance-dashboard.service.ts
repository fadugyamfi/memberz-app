import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { MemberAccount } from '../../model/api/member-account';
import { map } from 'rxjs/operators';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceDashboardService extends APIService<MemberAccount> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/contribution_summaries';
    this.model = MemberAccount;
    this.model_name = 'MemberAccount';
  }

  getWeeklyBreakdown(month = null, year = null) {
    const params = {
      month,
      year
    };

    return this.get(`${this.url}/weekly_breakdown`, params);
  }

  getTotalsByCategory(year = null) {
    const params = {
      year
    };
    
    return this.get(`${this.url}/totals_by_category`, params);
  }

  getCategoryBreakdown(month = null, year = null) {
    const params = {
      month,
      year
    };

    return this.get(`${this.url}/category_breakdown`, params);
  }

}
