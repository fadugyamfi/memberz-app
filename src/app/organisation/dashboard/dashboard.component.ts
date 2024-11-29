import { Component, OnInit, OnDestroy } from '@angular/core';
import moment from 'moment';
import { catchError, map, Observable } from 'rxjs';
import { OrganisationMember } from '../../shared/model/api/organisation-member';
import { OrganisationMemberService } from '../../shared/services/api/organisation-member.service';
import { GeneralStatisticsComponent } from './general-statistics/general-statistics.component';
import { MembershipOverviewComponent } from './membership-overview/membership-overview.component';
import { LoadingRotateDashedComponent } from '../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AvatarModule } from 'ngx-avatars';
import { ViewProfileDirective } from '../../shared/directives/view-profile.directive';
import { RouterLink } from '@angular/router';
import { SmsSummaryComponent } from '../../shared/components/charts/sms-summary/sms-summary.component';
import { FinanceTrendComponent } from '../../shared/components/charts/finance-trend/finance-trend.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [GeneralStatisticsComponent, MembershipOverviewComponent, LoadingRotateDashedComponent, AvatarModule, ViewProfileDirective, RouterLink, SmsSummaryComponent, FinanceTrendComponent, AsyncPipe, DatePipe, TranslateModule]
})
export class DashboardComponent implements OnInit, OnDestroy {

  public todaysBirthdays$: Observable<any>;

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
