import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { MemberAccount } from '../../model/api/member-account';
import { map } from 'rxjs/operators';
import { StorageService } from '../storage.service';
import { Organisation } from '../../model/api/organisation';

@Injectable({
  providedIn: 'root'
})
export class MemberAccountService extends APIService<MemberAccount> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/member_accounts';
    this.model = MemberAccount;
    this.model_name = 'MemberAccount';
  }

  login(username: string, password: string) {

    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return this.post(`${this.url}/login`, body.toString(), null, headers).pipe(map(res => {
      return new MemberAccount(res['account']);
    }));
  }

  /**
   * Fetch all organisations for a member
   *
   * @param memberAccountId Id of user account
   */
  organisations(memberAccountId: number, page = 1, limit = 15) {
    const params = {
      page,
      limit
    };

    return this.get(`${this.url}/${memberAccountId}/organisations`, params).pipe(map(res => {
      const userOrgs = res['data'].map((data: object) => new Organisation(data));
      this.storeUserOrganisations(userOrgs);
      return userOrgs;
    }));
  }

  getAccountByMemberId(memberId: number) {
    const params = {
      member_id: memberId,
      contain: ['organisation_accounts.organisation_role'].join()
    };

    return this.get(`${this.url}`, params).pipe(map(res => {
      return res['data'][0] ? new MemberAccount(res['data'][0]) : null;
    }));
  }

  storeUserOrganisations(userOrgs: Organisation[]) {
    this.storage.set('auth_user_organisations', userOrgs);
  }

  getUserOrganisations(): Organisation[] {
    return this.storage.get('auth_user_organisations').map(org => new Organisation(org));
  }
}
