import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { MemberRelationService } from '../../../../shared/services/api/member-relation.service';

@Component({
  selector: 'app-profile-family',
  templateUrl: './profile-family.component.html',
  styleUrls: ['./profile-family.component.scss']
})
export class ProfileFamilyComponent implements OnInit, OnDestroy {

  public mbsp: OrganisationMember;
  public subscriptions: Subscription[] = [];

  constructor(
    public memberRelationService: MemberRelationService
  ) { }

  ngOnInit(): void {
    this.loadRelations();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  loadRelations() {
    const sub = this.memberRelationService.getAll({
      member_id: this.membership.member_id
    }).subscribe();

    this.subscriptions.push(sub);
  }
}
