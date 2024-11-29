import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, RouterLinkActive, RouterLink } from '@angular/router';
import { NavService, Menu } from '../../services/nav.service';
import { AuthService } from '../../services/api/auth.service';
import { OrganisationService } from '../../services/api/organisation.service';
import { EventsService } from '../../services/events.service';
import { StorageService } from '../../services/storage.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MemberImageService } from '../../services/api/member-image.service';
import { Organisation } from '../../model/api/organisation';
import { NgClass } from '@angular/common';
import { AvatarModule } from 'ngx-avatars';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { AdminHasPermissionDirective } from '../../directives/admin-has-permission.directive';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-organisation-sidebar',
    templateUrl: './organisation-sidebar.component.html',
    styleUrls: ['./organisation-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [AvatarModule, ImageCropperComponent, NgClass, AdminHasPermissionDirective, FeatherIconsComponent, RouterLinkActive, RouterLink, TranslateModule]
})
export class OrganisationSidebarComponent implements OnInit {

  public menuItems: Menu[];
  public url: any;
  public fileurl: any;
  public organisation: Organisation;

  constructor(
    public router: Router,
    public navServices: NavService,
    public authService: AuthService,
    public events: EventsService,
    public organisationService: OrganisationService,
    public storage: StorageService,
  ) {
    this.setupEvents();
    this.enableOrganisationMenuItems();
  }

  ngOnInit(): void {
    this.organisation = this.organisationService.getActiveOrganisation();
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

  enableOrganisationMenuItems() {
    this.navServices.organisationMenuItems.subscribe(menuItems => {
      this.menuItems = menuItems;
      this.setActiveNavElement(menuItems);
    });
  }

  setupEvents() {
    // this.events.on('active:organisation:set', () => this.enableOrganisationMenuItems());
  }

  switchOrganisation() {
    this.organisationService.clearActiveOrganisation();
    this.storage.clearAll(['auth', 'user']);
    this.router.navigate(['/portal/home']);
  }

  onCroppedImageSaved(image) {
    this.organisation = Object.assign(this.organisation, {
      logo: image,
      image_base64: image
    });

    this.organisationService.uploadLogo(this.organisation);
  }
}
