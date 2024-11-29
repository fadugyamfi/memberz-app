import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, RouterLinkActive, RouterLink } from '@angular/router';
import { NavService, Menu } from '../../services/nav.service';
import { AuthService } from '../../services/api/auth.service';
import { EventsService } from '../../services/events.service';
import { MemberImage } from '../../model/api/member-image';
import { MemberImageService } from '../../services/api/member-image.service';
import { NgClass } from '@angular/common';
import { AvatarModule } from 'ngx-avatars';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [AvatarModule, ImageCropperComponent, NgbProgressbarModule, NgClass, FeatherIconsComponent, RouterLinkActive, RouterLink, TranslateModule]
})
export class SidebarComponent implements OnInit, OnDestroy {

  public menuItems: Menu[];
  public url: any;
  public fileurl: any;
  public profileImageUrl: any;
  public imageUploadProgress = 0;

  constructor(
    public router: Router,
    public navServices: NavService,
    public authService: AuthService,
    public events: EventsService,
    public memberImageService: MemberImageService
  ) {
    this.navServices.portalMenuItems.subscribe(menuItems => {
      this.menuItems = menuItems;
      this.setActiveNavElement(menuItems);
    });
  }

  ngOnInit(): void {
    this.setupImageUploadEvents();
    this.profileImageUrl = this.authService.userData?.member?.image();
  }

  ngOnDestroy(): void {
    this.events.off([
      `MemberImage:upload:start`,
      `MemberImage:upload:progress`,
      'MemberImage:upload:complete'
    ]);
  }

  setActiveNavElement(menuItems) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        menuItems.filter(items => {
          if (items.path === event.url) {
            this.setNavActive(items);
          }
          if (!items.children) { return false; }
          items.children.filter(subItems => {
            if (subItems.path === event.url) {
              this.setNavActive(subItems);
            }
            if (!subItems.children) { return false; }
            subItems.children.filter(subSubItems => {
              if (subSubItems.path === event.url) {
                this.setNavActive(subSubItems);
              }
            });
          });
        });
      }
    });
  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      // eslint-disable-next-line eqeqeq
      if (menuItem != item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) { return false; }
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  }

  // Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    };
  }

  setupImageUploadEvents() {
    this.events.on(`MemberImage:upload:start`, () => this.imageUploadProgress = 1);
    this.events.on(`MemberImage:upload:progress`, (value) => this.imageUploadProgress = value);
    this.events.on('MemberImage:upload:complete', () => {
      this.imageUploadProgress = 0;
      this.authService.me().subscribe();
    });
  }

  onCroppedImageSaved(image) {
    this.profileImageUrl = image;

    const memberImage = new MemberImage({
      member_id: this.authService.userData.member_id,
      image_base64: image
    });

    this.memberImageService.createWithUpload(memberImage);
  }

}
