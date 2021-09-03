import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { Contribution } from '../../model/api/contribution';

@Injectable({
  providedIn: 'root'
})
export class ContributionService extends APIService<Contribution> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/contributions';
    this.model =  Contribution;
    this.model_name = 'Contribution';
  }

}
