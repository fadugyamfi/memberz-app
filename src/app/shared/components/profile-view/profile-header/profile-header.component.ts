import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MemberImage } from '../../../../shared/model/api/member-image';
import { OrganisationMember } from '../../../../shared/model/api/organisation-member';
import { MemberImageService } from '../../../../shared/services/api/member-image.service';
import { EventsService } from '../../../../shared/services/events.service';
import { AvatarModule } from 'ngx-avatars';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../image-cropper/image-cropper.component';
import { QrCodeModule } from 'ng-qrcode';
import { ProfileActionsComponent } from '../profile-actions/profile-actions.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-header',
    templateUrl: './profile-header.component.html',
    styleUrls: ['./profile-header.component.scss'],
    imports: [AvatarModule, NgbProgressbarModule, ImageCropperComponent, QrCodeModule, ProfileActionsComponent, TranslateModule]
})
export class ProfileHeaderComponent implements OnInit {

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
