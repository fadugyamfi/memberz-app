import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavService, Menu } from '../../services/nav.service';
import { AuthService } from '../../services/cakeapi/auth.service';
import { OrganisationService } from '../../services/cakeapi/organisation.service';
import { EventsService } from '../../services/events.service';
import { StorageService } from '../../services/storage.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-organisation-sidebar',
  templateUrl: './organisation-sidebar.component.html',
  styleUrls: ['./organisation-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganisationSidebarComponent extends SidebarComponent {

  public menuItems: Menu[];
  public url: any;
  public fileurl: any;

  constructor(
    router: Router,
    navServices: NavService,
    authService: AuthService,
    public events: EventsService,
    public organisationService: OrganisationService,
    public storage: StorageService
  ) {
    super(router, navServices, authService);
    this.setupEvents();
    this.enableOrganisationMenuItems();
  }

  enableOrganisationMenuItems() {
    this.navServices.organisationMenuItems.subscribe(menuItems => {
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
}
