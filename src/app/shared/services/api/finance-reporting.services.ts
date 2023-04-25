import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { MemberAccount } from '../../model/api/member-account';
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


  getIncomeSummary(data) {
    const params = {
      start_date: data.start_date,
      end_date: data.end_date,
      currency_id: data.currency_id
    };

    return this.get(`${this.url}/income_summary`, params);
  }

  getTopContributors(year, currency_id) {
    const params = {
      year,
      currency_id
    };

    return this.get(`${this.url}/top_contributors`, params);
  }

  getYearlySummaryReport(data) {
    const params = {
      year: data.year,
      currency_id: data.currency_id
    };

    return this.get(`${this.url}/monthly_consolidated_report`, params);
  }

  getContributorsByType(params: {
    year?: number,
    contribution_type_id: number,
    currency_id: number,
    start_date: string,
    end_date: string
  }) {
    return this.get(`${this.url}/contributors_by_type`, params);
  }
}
