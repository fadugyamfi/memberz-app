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
export class FinanceReportingService extends APIService<MemberAccount> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/finance_reporting';
    this.model = MemberAccount;
    this.model_name = 'MemberAccount';
  }


  getNonContributingMembers(year) {
    const params = {
      year
    };

    return this.get(`${this.url}/non_contributing_members`, params);
  }


  getIncomeSummary(start_date = null, end_date = null) {
    const params = {
      start_date,
      end_date
    };

    return this.get(`${this.url}/income_summary`, params);
  }

  getTotalsByCategory(year = null) {
    const params = {
      year
    };
    
    return this.get(`${this.url}/totals_by_category`, params);
  }

  getTrendReport(year = null) {
    const params = {
      year
    };
    
    return this.get(`${this.url}/trend_report`, params);
  }

  getCategoryBreakdown(month = null, year = null) {
    const params = {
      month,
      year
    };

    return this.get(`${this.url}/category_breakdown`, params);
  }

}
