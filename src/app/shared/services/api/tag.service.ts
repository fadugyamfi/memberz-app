import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../../model/api/tag';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class TagService extends APIService<Tag> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/tags';
    this.model =  Tag;
    this.model_name = 'Tag';
  }

}
