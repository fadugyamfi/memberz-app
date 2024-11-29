import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { AsyncPipe } from '@angular/common';
import { ViewProfileDirective } from '../../../shared/directives/view-profile.directive';
import { AvatarModule } from 'ngx-avatars';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-recently-updated',
    templateUrl: './recently-updated.component.html',
    styleUrls: ['./recently-updated.component.scss'],
    standalone: true,
    imports: [ViewProfileDirective, AvatarModule, AsyncPipe, TranslateModule]
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
    this.memberships$ = this.membershipService.getAll({ sort: 'modified:desc', limit: 3 });
  }
}
