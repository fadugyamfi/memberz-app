import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { ContributionService } from '../../../../shared/services/api/contribution.service';
import { Contribution } from '../../../model/api/contribution';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PaginationComponent } from '../../pagination/pagination.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-contributions',
    templateUrl: './profile-contributions.component.html',
    styleUrls: ['./profile-contributions.component.scss'],
    imports: [PaginationComponent, CurrencyPipe, DatePipe, TranslateModule]
})
export class ProfileContributionsComponent implements OnInit, OnDestroy {

  public mbsp: OrganisationMember;
  public subscriptions: Subscription[] = [];
  public contributions: Contribution[] = [];

  constructor(
    public contributionService: ContributionService
  ) { }

  ngOnInit(): void {
    this.loadContributions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadContributions(page = 1, limit = 10) {
    const sub = this.contributionService.getAll({
      organisation_member_id: this.membership.id,
      contain: ['contribution_receipt', 'contribution_type', 'currency'].join(','),
      sort: 'latest',
      limit,
      page
    }).subscribe(contributions => this.contributions = contributions);

    this.subscriptions.push(sub);
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  onPaginate(event: PageEvent) {
    this.loadContributions(event.page, event.limit);
  }
}
