import { Component, Input, OnInit } from '@angular/core';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { MemberRelationService } from '../../../../shared/services/api/member-relation.service';

@Component({
  selector: 'app-profile-family',
  templateUrl: './profile-family.component.html',
  styleUrls: ['./profile-family.component.scss']
})
export class ProfileFamilyComponent implements OnInit {

  public mbsp: OrganisationMember;

  constructor(
    public memberRelationService: MemberRelationService
  ) { }

  ngOnInit(): void {
    this.loadRelations();
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  loadRelations() {
    this.memberRelationService.getAll({
      member_id: this.membership.member_id
    }).subscribe();
  }
}
