import { Component, OnInit, input, model, output, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/operators';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { OrganisationMemberService } from '../../../../shared/services/api/organisation-member.service';
import { EventsService } from '../../../../shared/services/events.service';
import { MembershipCardModalComponent } from '../membership-card-modal/membership-card-modal.component';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MakeAdminComponent } from '../make-admin/make-admin.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-actions',
    templateUrl: './profile-actions.component.html',
    styleUrls: ['./profile-actions.component.scss'],
    imports: [NgbAlertModule, MakeAdminComponent, MembershipCardModalComponent, TranslateModule]
})
export class ProfileActionsComponent implements OnInit {

  readonly membershipCard = viewChild<MembershipCardModalComponent>('membershipCardModal');
  readonly membership = model<OrganisationMember>();
  readonly edit = output();

  private _messages = new Subject<string>();
  public alertMessage: string | null = '';
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
    console.log(this.membershipService);
    this.membershipService.setSelectedModel(this.membership());
    this.membershipService.setEditing(true);
    // this.router.navigate(['/organisation/memberships/edit', this.membership.id]);
    this.edit.emit();
  }

  viewMembershipCard() {
    this.membershipCard()?.show();
  }

  setupEvents() {
    this._messages.subscribe((message) => this.alertMessage = message);
    this._messages.pipe(
      debounceTime(5000)
    ).subscribe(() => this.alertMessage = null);

    this.events.on('OrganisationMember:updated', (profile) => {
      this.membership.set(profile);

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
