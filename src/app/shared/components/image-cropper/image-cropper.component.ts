import { Component, OnInit, ViewChild, output } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss'],
    imports: [ImageCropperModule, TranslateModule]
})
export class ImageCropperComponent implements OnInit {

  @ViewChild('cropperModal', { static: true }) messageModal: any;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  public modal: NgbModalRef;

  public readonly save = output();

  constructor(
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Shows the search modal
   */
  show() {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.modal = this.modalService.open(this.messageModal, { size: 'lg', backdrop: 'static' });
  }

  hide() {
    if (this.modal) {
      this.modal.close();
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  saveImage() {
    this.save.emit(this.croppedImage);
    this.modal.close();
  }
}
