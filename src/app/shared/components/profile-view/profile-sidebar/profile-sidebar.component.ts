import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MemberImage } from '../../../../shared/model/api/member-image';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { MemberImageService } from '../../../../shared/services/api/member-image.service';
import { EventsService } from '../../../../shared/services/events.service';
import { RouterLink } from '@angular/router';
import { ProfileImageComponent } from '../profile-image/profile-image.component';
import { QrCodeModule } from 'ng-qrcode';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-sidebar',
    templateUrl: './profile-sidebar.component.html',
    styleUrls: ['./profile-sidebar.component.scss'],
    standalone: true,
    imports: [RouterLink, ProfileImageComponent, QrCodeModule, TranslateModule]
})
export class ProfileSidebarComponent implements OnInit {

  public mbsp: OrganisationMember;

  public profileImageUrl: any;
  public imageUploadProgress = 0;

  constructor(
    public events: EventsService,
    public memberImageService: MemberImageService
  ) { }

  ngOnInit(): void {
    this.setupImageUploadEvents();
  }

  @Input()
  set membership(value) {
    this.mbsp = value;

    if ( this.mbsp ) {
      this.profileImageUrl = this.membership.member.image();
    }
  }

  get membership(): OrganisationMember {
    return this.mbsp;
  }

  setupImageUploadEvents() {
    this.events.on(`MemberImage:upload:start`, () => this.imageUploadProgress = 1);
    this.events.on(`MemberImage:upload:progress`, (value) => this.imageUploadProgress = value);
    this.events.on('MemberImage:upload:complete', () => this.imageUploadProgress = 0);
  }

  onCroppedImageSaved(image) {
    this.profileImageUrl = image;

    const memberImage = new MemberImage({
      member_id: this.membership.member_id,
      image_base64: image
    });

    this.memberImageService.createWithUpload(memberImage);
  }
}
