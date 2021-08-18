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

    this.refreshAccount();
  }

  refreshAccount(organisationId = null) {
    const params = this.getAccountParams(organisationId);

    return this.getAll(params).subscribe(accounts => {
      this.cacheAccountInfo(accounts);
      this.events.trigger(`${this.model_name}:refresh`, this.orgSmsAccount);
    });
  }

  private getAccountParams(organisationId = null) {
    if (!organisationId) {
      const organisation = this.orgService.getActiveOrganisation();
      organisationId = organisation ? organisation.id : null;
    }

    return { organisation_id: organisationId, limit: 1 };
  }

  getOrganisationAccount() {
    return this.storage.get('org_sms_account');
  }

  cacheAccountInfo(accounts) {
    this.orgSmsAccount = accounts[0];

    if (this.orgSmsAccount) {
      this.storage.set('org_sms_account', this.orgSmsAccount, 2, 'hours');
    }
  }
}
