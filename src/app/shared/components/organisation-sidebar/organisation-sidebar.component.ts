import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavService, Menu } from '../../services/nav.service';
import { AuthService } from '../../services/cakeapi/auth.service';
import { OrganisationService } from '../../services/cakeapi/organisation.service';
import { EventsService } from '../../services/events.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-organisation-sidebar',
  templateUrl: './organisation-sidebar.component.html',
  styleUrls: ['./organisation-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganisationSidebarComponent {

  public menuItems: Menu[];
  public url: any;
  public fileurl: any;

  constructor(
    private router: Router,
    public navServices: NavService,
    public authService: AuthService,
    public events: EventsService,
    public organisationService: OrganisationService,
    public storage: StorageService
  ) {
    this.setupEvents();
    this.enableOrganisationMenuItems();
  }

  enableOrganisationMenuItems() {
    this.navServices.organisation_items.subscribe(menuItems => {
      this.menuItems = menuItems
      this.setActiveNavElement(menuItems);
    });
  }

  setupEvents() {
    //this.events.on('active:organisation:set', () => this.enableOrganisationMenuItems());
  }

  switchOrganisation() {
    this.organisationService.clearActiveOrganisation();
    this.storage.clearAll(['auth', 'user']);
    this.router.navigate(['/portal/home']);
  }

  setActiveNavElement(menuItems) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        menuItems.filter(items => {
          if (items.path === event.url)
            this.setNavActive(items)
          if (!items.children) return false
          items.children.filter(subItems => {
            if (subItems.path === event.url)
              this.setNavActive(subItems)
            if (!subItems.children) return false
            subItems.children.filter(subSubItems => {
              if (subSubItems.path === event.url)
                this.setNavActive(subSubItems)
            })
          })
        })
      }
    });
  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem != item)
        menuItem.active = false
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true
            submenuItems.active = true
          }
        })
      }
    })
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item))
          a.active = false
        if (!a.children) return false
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false
          }
        })
      });
    }
    item.active = !item.active
  }

  //Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

}
