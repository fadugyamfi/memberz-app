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

    this.url = '/finance_dashboard';
    this.model = MemberAccount;
    this.model_name = 'MemberAccount';
  }


  /**
   * Fetch summary of financial transactions trend by year
   *
   */
   trend(year: number) {
     //
  }

   /**
   * Fetch summary of financial transactions weekly breakdown by year and by month
   *
   */
    weeklyBreakdown(year: number, month: number) {
      //
   }

    /**
   * Fetch summary of financial transactions totals by category by year
   *
   */
     totalsByCategory(year: number) {
      //
   }

    /**
   * Fetch summary of financial transactions category breakdown by year and by month
   *
   */
     cateogryBreakdown(year: number, month: number) {
      //
   }
}
