import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../model/api/country';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends APIService {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/countries';
    this.model =  Country;
    this.model_name = 'Country';
  }

}
