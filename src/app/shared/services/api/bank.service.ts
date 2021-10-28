import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { Bank } from '../../model/api/bank';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class BankService extends APIService<Bank> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/banks';
    this.model =  Bank;
    this.model_name = 'Bank';
  }

}
