import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/operators';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { OrganisationMemberService } from '../../../../shared/services/api/organisation-member.service';
import { EventsService } from '../../../../shared/services/events.service';
import { MembershipCardModalComponent } from '../membership-card-modal/membership-card-modal.component';

@Component({
  selector: 'app-profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss']
})
export class ProfileActionsComponent implements OnInit {

  @ViewChild('membershipCardModal', { static: true }) membershipCard: MembershipCardModalComponent;
  @Input() membership: OrganisationMember;

  private _messages = new Subject<string>();
  public alertMessage = '';
  public alertType = 'success';

  constructor(
    public membershipService: OrganisationMemberService,
    public router: Router,
    public events: EventsService
  ) { }

  ngOnInit(): void {
    this.setupEvents();
  }


  editProfile() {
    this.membershipService.setSelectedModel(this.membership);
    this.router.navigate(['/organisation/memberships/edit', this.membership.id]);
  }

  viewMembershipCard() {
    this.membershipCard.show();
  }

  setupEvents() {
    this._messages.subscribe((message) => this.alertMessage = message);
    this._messages.pipe(
      debounceTime(5000)
    ).subscribe(() => this.alertMessage = null);

    this.events.on('OrganisationMember:updated', (profile) => {
      this.membership = profile;

      if (profile.approved && profile.active) {
        this.alertType = 'success';
        this._messages.next(`Registration Approved. New Membership Number: ${profile.organisation_no}`);
      } else if (!profile.approved && !profile.active) {
        this.alertType = 'danger';
        this._messages.next('Registration Rejected');
      }
    });
  }
}
