import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { catchError, map } from 'rxjs';
import { OrganisationMember } from '../../shared/model/api/organisation-member';
import { OrganisationMemberService } from '../../shared/services/api/organisation-member.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public todaysBirthdays$;

  constructor(
    public membershipService: OrganisationMemberService
  ) {}

  ngOnInit() {
    this.fetchTodaysBirthdays();
  }

  ngOnDestroy() {

  }

  fetchTodaysBirthdays() {
    return this.todaysBirthdays$ = this.membershipService.birthdays({
      'month': moment().utc().month() + 1,
      'day': moment().utc().date(),
    }).pipe(
      map(response => {
        return response['data'].map(data => new OrganisationMember(data));
      }),
      catchError(() => {
        return this.fetchTodaysBirthdays();
      })
    )
  }
}
