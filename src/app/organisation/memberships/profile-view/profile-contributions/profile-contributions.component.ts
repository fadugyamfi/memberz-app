import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '../../../../shared/components/pagination/pagination.component';
import { MemberRelation } from '../../../../shared/model/api/member-relation';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { ContributionService } from '../../../../shared/services/api/contribution.service';

@Component({
  selector: 'app-profile-contributions',
  templateUrl: './profile-contributions.component.html',
  styleUrls: ['./profile-contributions.component.scss']
})
export class ProfileContributionsComponent implements OnInit {

  public mbsp: OrganisationMember;
  public subscriptions: Subscription[] = [];

  constructor(
    public contributionService: ContributionService
  ) { }

  ngOnInit(): void {
    this.loadContributions();
  }

  loadContributions(page = 1, limit = 10) {
    const sub = this.contributionService.getAll({
      organisation_member_id: this.membership.id,
      contain: ['contribution_receipt', 'contribution_type', 'currency'].join(','),
      sort: 'latest',
      limit,
      page
    }).subscribe();

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
