import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { MemberAccount } from '../../model/api/member-account';

@Injectable({
  providedIn: 'root'
})
export class TwoFaService extends APIService<MemberAccount>{

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/2fa';
    this.model =  MemberAccount;
    this.model_name = 'MemberAccount';
  }

  sendCode() {
    return this.get(`${this.url}/send-code`);
  }
}
