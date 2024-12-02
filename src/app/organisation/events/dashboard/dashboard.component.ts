import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { catchError, map, Observable } from 'rxjs';
import { OrganisationEvent } from '../../../shared/model/api/organisation-event';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { MemberService } from '../../../shared/services/api/member.service';
import { OrganisationEventService } from '../../../shared/services/api/organisation-event.service';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { AsyncPipe, DecimalPipe, DatePipe } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingRotateDashedComponent } from '../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { AvatarModule } from 'ngx-avatars';
import { ViewProfileDirective } from '../../../shared/directives/view-profile.directive';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [NgbTooltipModule, LoadingRotateDashedComponent, AvatarModule, ViewProfileDirective, RouterLink, AsyncPipe, DecimalPipe, DatePipe, TranslateModule]
})
export class DashboardComponent implements OnInit {

  public $upcomingEvents: Observable<OrganisationEvent[]>;
  public upcomingEventCount$: Observable<object>;
  public birthdaySummary$: Observable<object>;
  public eventStatistics$: Observable<object>;

  public todaysBirthdays$;

  constructor(
    public eventService: OrganisationEventService,
    public memberService: MemberService,
    public membershipService: OrganisationMemberService
  ) { }

  ngOnInit(): void {
    this.fetchUpcomingEvents();
    this.loadStatistics();
    this.fetchTodaysBirthdays();
  }

  fetchUpcomingEvents() {
    const params = { page: 1, limit: 5, sort: 'start_dt:asc', start_dt_gt: moment().utc().format('YYYY-MM-DD HH:00') };

    this.$upcomingEvents = this.eventService.getAll(params);
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

  loadStatistics() {
    this.upcomingEventCount$ = this.eventService.count({
      'start_dt_gte': moment().utc().format('YYYY-MM-DD')
    });

    this.eventStatistics$ = this.eventService.statistics();

    this.birthdaySummary$ = this.membershipService.birthdaySummary();
  }
}
