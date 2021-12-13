import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../../model/api/currency';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService extends APIService<Currency> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/currencies';
    this.model =  Currency;
    this.model_name = 'Currency';
  }

}
