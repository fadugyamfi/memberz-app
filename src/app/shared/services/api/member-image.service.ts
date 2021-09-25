import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { MemberImage } from '../../model/api/member-image';

@Injectable({
  providedIn: 'root'
})
export class MemberImageService extends APIService<MemberImage> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/member_images';
    this.model =  MemberImage;
    this.model_name = 'MemberImage';
  }

}
