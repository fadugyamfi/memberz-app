import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SmsAccount } from '../../model/cakeapi/sms-account';
import { map } from 'rxjs/operators';
import { OrganisationService } from './organisation.service';

@Injectable({
  providedIn: 'root'
})
export class SmsAccountService extends APIService {

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

  refreshAccount(organisation_id = null) {
    const params = this.getAccountParams(organisation_id);

    return this.getAll<SmsAccount[]>(params).subscribe(accounts => {
      this.cacheAccountInfo(accounts);
      this.events.trigger(`${this.model_name}:refresh`, this.orgSmsAccount);
    });
  }

  private getAccountParams(organisation_id = null) {
    if (!organisation_id) {
      const organisation = this.orgService.getActiveOrganisation();
      if (organisation) {
        organisation_id = organisation.id;
      }
    }

    return { organisation_id, limit: 1 };
  }

  getOrganisationAccount() {
    return this.storage.get('org_sms_account');
  }

  cacheAccountInfo(accounts) {
    this.orgSmsAccount = accounts[0];

    if (this.orgSmsAccount) {
      this.storage.set('org_sms_account', this.orgSmsAccount, 1, 'hours');
    }
  }
}
