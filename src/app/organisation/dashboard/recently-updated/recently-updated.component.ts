import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';

@Component({
  selector: 'app-recently-updated',
  templateUrl: './recently-updated.component.html',
  styleUrls: ['./recently-updated.component.scss']
})
export class RecentlyUpdatedComponent implements OnInit {

  public memberships$: Observable<OrganisationMember[]>;

  constructor(
    public membershipService: OrganisationMemberService
  ) { }

  ngOnInit(): void {
    this.fetchMemberships();
  }

  fetchMemberships() {
    this.memberships$ = this.membershipService.getAll({ sort: 'latest', limit: 3 });
  }
}
