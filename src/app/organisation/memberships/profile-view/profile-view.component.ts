import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganisationMember } from '../../../shared/model/api/organisation-member';
import { Subscription, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { EventsService } from '../../../shared/services/events.service';
import { debounceTime } from 'rxjs/operators';
import { MemberImageService } from '../../../shared/services/api/member-image.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberImage } from '../../../shared/model/api/member-image';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, OnDestroy {

  @ViewChild('imageCropper') imageCropper: ImageCropperComponent;

  private _messages = new Subject<string>();
  public alertMessage = '';
  public alertType = 'success';
  public membership: OrganisationMember;
  public active = 1;

  public subscriptions: Subscription[] = [];

  constructor(
    public membershipService: OrganisationMemberService,
    public route: ActivatedRoute,
    public router: Router,
    public events: EventsService
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

    if (!this.membership) {
      const sub = this.route.params.subscribe(params => {
        const membership_id = params.id; // (+) converts string 'id' to a number

        const ps = this.membershipService.getProfile(membership_id).subscribe((membership: OrganisationMember) => {
          this.membership = membership;
          // close any open loader
          Swal.close();
        });

        this.active = 1;
        this.subscriptions.push(ps);
      });

      this.subscriptions.push(sub);
    }
  }

  editProfile() {
    this.membershipService.setSelectedModel(this.membership);
    this.router.navigate(['/organisation/memberships/edit', this.membership.id]);
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
