import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrganisationMemberService } from '../../../shared/services/cakeapi/organisation-member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationMember } from '../../../shared/model/cakeapi/organisation-member';
import { Subscription, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { EventsService } from '../../../shared/services/events.service';
import { debounceTime } from 'rxjs/operators';
import { MemberAccountService } from '../../../shared/services/cakeapi/member-account.service';
import { MemberAccount } from '../../../shared/model/cakeapi/member-account';
import { OrganisationService } from '../../../shared/services/cakeapi/organisation.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, OnDestroy {

  private _messages = new Subject<string>();
  public alertMessage = '';
  public alertType = 'success';
  public membership: OrganisationMember;

  public subscriptions: Subscription[] = [];

  constructor(
    public membershipService: OrganisationMemberService,
    public route: ActivatedRoute,
    public router: Router,
    public events: EventsService,
  ) { }

  ngOnInit() {
    this.setupEvents();
    this.loadProfile();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadProfile() {
    this.membership = this.membershipService.getSelectedModel();

    if( !this.membership ) {
      const sub = this.route.params.subscribe(params => {
        const membership_id = params['id']; // (+) converts string 'id' to a number

        const ps = this.membershipService.getProfile(membership_id).subscribe((membership: OrganisationMember) => {
          this.membership = membership;
        });

        this.subscriptions.push(ps);
      });

      this.subscriptions.push(sub);
    }
  }

  

  editProfile() {
    this.membershipService.setSelectedModel(this.membership);
    this.router.navigate(['/organisation/memberships/edit', this.membership.id])
  }

  setupEvents() {
    this._messages.subscribe((message) => this.alertMessage = message);
    this._messages.pipe(
      debounceTime(5000)
    ).subscribe(() => this.alertMessage = null);

    this.events.on('OrganisationMember:updated', (profile) => {
      this.membership = profile;
      
      if( profile.approved && profile.active ) {
        this.alertType = 'success';
        this._messages.next(`Registration Approved. New Membership Number: ${profile.organisation_no}`);
      } 

      else if( !profile.approved && !profile.active ) {
        this.alertType = 'danger';
        this._messages.next("Registration Rejected");
      }
    });
  }

  
}
