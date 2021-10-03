import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SmsAccount } from '../../model/api/sms-account';
import { OrganisationService } from './organisation.service';

@Injectable({
  providedIn: 'root'
})
export class SmsAccountService extends APIService<SmsAccount> {

  public orgSmsAccount: SmsAccount;
  private accountCacheKey: string = null;

  constructor(
    http: HttpClient,
    protected events: EventsService,
    protected storage: StorageService,
    private orgService: OrganisationService
  ) {
    super(http, events, storage);

    this.url = '/sms_accounts';
    this.model = SmsAccount;
    this.model_name = 'SmsAccount';

    this.setAccountCacheKey();
  }

  setAccountCacheKey(organisation_id = null) {
    if ( !organisation_id ) {
      const organisation = this.orgService.getActiveOrganisation();
      organisation_id = organisation ? organisation.id : null;
    }

    this.accountCacheKey = `org_${organisation_id}_sms_account`;
  }

  refreshAccount(organisation_id = null) {
    this.setAccountCacheKey(organisation_id);
    const params = { organisation_id, limit: 1 };

    return this.getAll(params).subscribe(accounts => {
      this.cacheAccountInfo(accounts);
      this.events.trigger(`${this.model_name}:refresh`, this.orgSmsAccount);
    });
  }

  hasOrganisationAccount() {
    return this.storage.has(this.accountCacheKey);
  }

  getOrganisationAccount() {
    return this.storage.get(this.accountCacheKey);
  }

  cacheAccountInfo(accounts) {
    this.orgSmsAccount = accounts[0];

    if (this.orgSmsAccount) {
      this.storage.set(this.accountCacheKey, this.orgSmsAccount, 1, 'days');
    }
  }
}
