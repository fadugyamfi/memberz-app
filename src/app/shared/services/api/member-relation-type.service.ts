import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { MemberRelationType } from '../../model/api/member-relation-type';

@Injectable({
  providedIn: 'root'
})
export class MemberRelationTypeService extends APIService<MemberRelationType> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/member_relation_types';
    this.model =  MemberRelationType;
    this.model_name = 'MemberRelationType';
  }

}
