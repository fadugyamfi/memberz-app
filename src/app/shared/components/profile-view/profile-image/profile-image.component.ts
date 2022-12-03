import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MemberImage } from '../../../model/api/member-image';
import { OrganisationMember } from '../../../model/api/organisation-member';
import { MemberImageService } from '../../../services/api/member-image.service';
import { EventsService } from '../../../services/events.service';
import { ImageCropperComponent } from '../../image-cropper/image-cropper.component';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {

  @ViewChild('imageCropper', { static: true }) imageCropper: ImageCropperComponent;

  @Input()
  public membership: OrganisationMember;

  @Input()
  public size: number|string = 60;

  public profileImageUrl: any;
  public imageUploadProgress = 0;
  public uploading = false;

  constructor(
    public events: EventsService,
    public memberImageService: MemberImageService
  ) { }

  ngOnInit(): void {
    this.setupImageUploadEvents();
    this.profileImageUrl = this.membership.member.image();
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
    this.profileImageUrl = image;

    const memberImage = new MemberImage({
      member_id: this.membership.member_id,
      image_base64: image
    });

    this.memberImageService.createWithUpload(memberImage);
  }
}
