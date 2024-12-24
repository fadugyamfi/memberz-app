import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { OrganisationAccount } from '../../model/api/organisation-account';
import { StorageService } from '../storage.service';
import { concat, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganisationAccountService extends APIService<OrganisationAccount> {

  public activeAccount: OrganisationAccount;

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/organisation_accounts';
    this.model =  OrganisationAccount;
    this.model_name = 'OrganisationAccount';

    this.loadActiveAccount();
  }

  fetchAdminAccount(organisation_id: number, member_account_id: number, params = null, headers = null) {
    return this.get(`/organisation_accounts/${organisation_id}/${member_account_id}`, params, headers).pipe(
      map(response => new OrganisationAccount(response['data'])),
      tap((account: OrganisationAccount) => this.setActiveAccount(account))
    );
  }

  setActiveAccount(account: OrganisationAccount) {
    this.storage.set('active_org_account', account);
    this.activeAccount = account;
  }

  getActiveAccount() {
    return this.activeAccount;
  }

  loadActiveAccount() {
    const account = this.storage.get('active_org_account');
    if( account ) {
      this.activeAccount = new OrganisationAccount(account);
    }
  }

  refreshActiveAccount() {
    if( !this.activeAccount ) {
      console.error("No active account to refresh");
      return;
    }

    return this.fetchAdminAccount(this.activeAccount.organisation_id, this.activeAccount.member_account_id);
  }
}
