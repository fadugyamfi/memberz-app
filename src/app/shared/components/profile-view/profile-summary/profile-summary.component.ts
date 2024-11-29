import { Component, Input, OnInit } from '@angular/core';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { NgIf, TitleCasePipe, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-summary',
    templateUrl: './profile-summary.component.html',
    styleUrls: ['./profile-summary.component.scss'],
    standalone: true,
    imports: [NgIf, TitleCasePipe, DatePipe, TranslateModule]
})
export class ProfileSummaryComponent implements OnInit {

  public mbsp: OrganisationMember;

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set membership(value) {
    this.mbsp = value;
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  hasWorkInformation() {
    return this.membership && this.membership.member && this.membership.member.occupation;
  }

  hasContactInformation() {
    return this.membership
      && this.membership.member
      && (this.membership.member.email || this.membership.member.mobile_number);
  }
}
