import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { ContributionType } from '../../model/api/contribution-type';

@Injectable({
  providedIn: 'root'
})
export class ContributionTypeService extends APIService<ContributionType> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/contribution_types';
    this.model =  ContributionType;
    this.model_name = 'ContributionType';
  }

}
