import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { ContributionReceiptSetting } from '../../model/api/contribution-receipt-setting';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributionReceiptSettingService extends APIService<ContributionReceiptSetting> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/contribution_receipt_settings';
    this.model =  ContributionReceiptSetting;
    this.model_name = 'ContributionReceiptSetting';
  }

  public fetchSettings(): Observable<ContributionReceiptSetting> {
    return this.get(this.url).pipe(map(result => {
      return new ContributionReceiptSetting(result);
    }));
  }
}
