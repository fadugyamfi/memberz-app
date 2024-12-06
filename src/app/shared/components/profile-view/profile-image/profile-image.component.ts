import { Component, OnInit, ViewChild, input, model } from '@angular/core';
import { MemberImage } from '../../../model/api/member-image';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { MemberImageService } from '../../../services/api/member-image.service';
import { EventsService } from '../../../services/events.service';
import { ImageCropperComponent } from '../../image-cropper/image-cropper.component';
import { AvatarModule } from 'ngx-avatars';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-profile-image',
    templateUrl: './profile-image.component.html',
    styleUrls: ['./profile-image.component.scss'],
    imports: [AvatarModule, NgbProgressbarModule, ImageCropperComponent]
})
export class ProfileImageComponent implements OnInit {

  @ViewChild('imageCropper', { static: true }) imageCropper: ImageCropperComponent;

  public readonly membership = model<OrganisationMember>();

  public readonly size = input<number | string>(60);

  public readonly thumbnail = model(false);

  public readonly name = model<string>();

  public readonly profileImageUrl = model<any>(undefined);

  public imageUploadProgress = 0;
  public uploading = false;

  constructor(
    public events: EventsService,
    public memberImageService: MemberImageService
  ) { }

  ngOnInit(): void {
    this.setupImageUploadEvents();

    const thumbnail = this.thumbnail();
    const membership = this.membership();
    if( !this.profileImageUrl() && (thumbnail || membership) ) {
      this.profileImageUrl.set(
        thumbnail
          ? membership?.member?.thumbnail()
          : membership?.member?.image()
      );
    }

    if( membership ) {
      this.name.set(membership.name())
    }
  }

  setupImageUploadEvents() {
    this.events.on(`MemberImage:upload:start`, () => {
      if( !this.uploading ) return;
      this.imageUploadProgress = 1
    });

    this.events.on(`MemberImage:upload:progress`, (value) => {
      if( !this.uploading ) return;
      this.imageUploadProgress = value
    });

    this.events.on('MemberImage:upload:complete', () => {
      if( !this.uploading ) return;
      this.imageUploadProgress = 0;
      this.uploading = false;
    });
  }

  onImageClicked() {
    this.showImageCropper();
  }

  showImageCropper() {
    this.imageCropper.show();
  }

  onCroppedImageSaved(image: string) {
    this.uploading = true;
    this.profileImageUrl.set(image);

    const memberImage = new MemberImage({
      member_id: this.membership()?.member_id,
      image_base64: image
    });

    this.memberImageService.createWithUpload(memberImage);
  }
}
