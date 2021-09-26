import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { UserActivity } from '../../model/api/user-activity';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService extends APIService<UserActivity> {


  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/activity_logs';
    this.model = UserActivity;
    this.model_name = 'UserActivity';
  }

  findActivities(options = {}, page = 1, limit = 15) {
    const params = Object.assign(options, {
      contain: ['causer.member'].join(),
      page,
      limit,
      sort: 'created_at:desc',
    });

    return this.search(params);
  }
}
