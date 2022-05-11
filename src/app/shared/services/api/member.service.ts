import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { Member } from '../../model/api/member';
import { Organisation } from '../../model/api/organisation';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends APIService<Member> {

  constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
    super(http, events, storage);

    this.url = '/members';
    this.model = Member;
    this.model_name = 'Member';
  }

  findMembers(options: object, page = 1, limit = 30) {
    const params = Object.assign(options, {
      contain: ['member.profile_photo', 'organisation_member_category'].join(),
      page,
      limit,
      sort: 'last_name:asc'
    });

    return this.search(params);
  }

  getProfile(id: number) {
    const params = {
      contain: ['profile_photo'].join()
    };

    return this.getById(id, params);
  }

  /**
   * Fetch all organisations for a member
   *
   * @param memberId Id of user account
   */
  organisations(memberId: number, page = 1, limit = 15) {
    const params = {
      page,
      limit
    };

    return this.get(`${this.url}/${memberId}/organisations`, params).pipe(map(res => {
      return res['data'].map((data: object) => new Organisation(data));
    }));
  }
}
