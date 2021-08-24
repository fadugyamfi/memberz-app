import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { MemberRelation } from '../../model/api/member-relation';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class MemberRelationService extends APIService<MemberRelation> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/member_relations';
    this.model =  MemberRelation;
    this.model_name = 'MemberRelation';
  }

}
