import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { Subscription, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { EventsService } from '../../../shared/services/events.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { OrganisationService } from '../../services/api/organisation.service';
import { NgClass } from '@angular/common';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { ProfileActionsComponent } from './profile-actions/profile-actions.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { ProfileGroupsComponent } from './profile-groups/profile-groups.component';
import { ProfileFamilyComponent } from './profile-family/profile-family.component';
import { ProfileAnniversariesComponent } from './profile-anniversaries/profile-anniversaries.component';
import { ProfileSmsMessagesComponent } from './profile-sms-messages/profile-sms-messages.component';
import { ProfileContributionsComponent } from './profile-contributions/profile-contributions.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';

@Component({
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.scss'],
    imports: [ProfileHeaderComponent, ProfileSidebarComponent, NgClass, ProfileActionsComponent, NgbNavModule, ProfileSummaryComponent, ProfileGroupsComponent, ProfileFamilyComponent, ProfileAnniversariesComponent, ProfileSmsMessagesComponent, ProfileContributionsComponent, ProfileEditorComponent, TranslateModule]
})
export class ProfileViewComponent implements OnInit, OnDestroy {

  @Input() public layout = 'default';
  public activeTabId = 1;
  public _membership: OrganisationMember;

  public subscriptions: Subscription[] = [];

  constructor(
    public membershipService: OrganisationMemberService,
    public organisationService: OrganisationService,
    public route: ActivatedRoute,
    public router: Router,
    public events: EventsService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.loadProfile();

    this.events.on('OrganisationMember:updated', (membership) => {
      this.loadProfile()
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @Input()
  set membership(value) {
    this._membership = value;

    if( !value ) {
      return;
    }

    this.membershipService.setEditing(false);
    const isMembershipWithoutProfile = this._membership && this._membership.id && !this._membership.name();
    if( isMembershipWithoutProfile ) {
      this.loadProfileById(this._membership.id);
    }

    this.activeTabId = 1;
  }

  get membership() {
    return this._membership;
  }

  loadProfile() {
    this.membership = this.membershipService.getSelectedModel();

    if (!this.membership) {
      const sub = this.route.params.subscribe(params => {
        const membership_id = params.id; // (+) converts string 'id' to a number
        this.loadProfileById(membership_id);
      });

      this.subscriptions.push(sub);
      return;
    }

    this.activeTabId = 1;
  }

  loadProfileById(membership_id) {
    if( !membership_id ) return;

    Swal.fire(
      this.translate.instant('Loading Membership Profile'),
      this.translate.instant('Please Wait'),
      'info'
    );
    Swal.showLoading();

    const ps = this.membershipService.getProfile(membership_id).subscribe((membership: OrganisationMember) => {
      this.activeTabId = 1;
      this.membership = membership;
      // close any open loader
      Swal.close();
    });

    this.subscriptions.push(ps);
  }

  loadProfileByMemberId(member_id) {
    if( !member_id ) return;

    Swal.fire(
      this.translate.instant('Loading Membership Profile'),
      this.translate.instant('Please Wait'),
      'info'
    );
    Swal.showLoading();

    const organisation = this.organisationService.getActiveOrganisation();

    const ps = this.membershipService.getAll({ member_id, organisation_id: organisation.id, limit: 1 }).subscribe((memberships: OrganisationMember[]) => {
      this.activeTabId = 1;
      this.membership = memberships[0];
      // close any open loader
      Swal.close();
    });

    this.subscriptions.push(ps);
  }

  isDefaultLayout() {
    return this.layout == 'default';
  }

  onMembershipUpdated(membership: OrganisationMember) {
    this.membership = membership;
  }
}
