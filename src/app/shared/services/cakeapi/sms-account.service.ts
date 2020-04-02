import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { SmsAccount } from '../../model/cakeapi/sms-account';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SmsAccountService extends APIService {

  public orgSmsAccount: SmsAccount;

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/sms_accounts';
    this.model = SmsAccount;
    this.model_name = 'SmsAccount';
  }

  fetchAccount(organisation_id) {
    const params = { organisation_id, limit: 1 };

    return this.getAll<SmsAccount[]>(params).pipe(map(res => {
      this.orgSmsAccount = res[0];
      return res;
    }));
  }

  getOrganisationAccount() {
    return this.orgSmsAccount;
  }
}
