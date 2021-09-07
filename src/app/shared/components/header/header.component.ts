import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/api/auth.service';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../services/storage.service';
import { EventsService } from '../../services/events.service';
import { NotificationService } from '../../services/api/notification.service';
import { Notification } from '../../model/api/notification';

const body = document.getElementsByTagName('body')[0];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public menuItems: Menu[];
  public items: Menu[];
  public searchResult = false;
  public searchResultEmpty = false;
  public openNav = false;
  public right_sidebar = false;
  public text: string;
  public isOpenMobile = false;
  public unreadNotifications = [];

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(
    public navServices: NavService,
    private translate: TranslateService,
    public authService: AuthService,
    protected storage: StorageService,
    public events: EventsService,
    public notificationService: NotificationService,
  ) {
    translate.setDefaultLang('en');
  }

  ngOnDestroy() {
    this.removeFix();
  }


  right_side_bar() {
    this.right_sidebar = !this.right_sidebar;
    this.rightSidebarEvent.emit(this.right_sidebar);
  }

  collapseSidebar() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  public changeLanguage(lang) {
    this.translate.use(lang);
  }

  searchTerm(term: any) {
    term ? this.addFix() : this.removeFix();
    if (!term) { return this.menuItems = []; }
    const items = [];
    term = term.toLowerCase();
    this.items.filter(menuItems => {
      if (menuItems.title.toLowerCase().includes(term) && menuItems.type === 'link') {
        items.push(menuItems);
      }
      if (!menuItems.children) { return false; }
      menuItems.children.filter(subItems => {
        if (subItems.title.toLowerCase().includes(term) && subItems.type === 'link') {
          subItems.icon = menuItems.icon;
          items.push(subItems);
        }
        // tslint:disable-next-line: curly
        if (!subItems.children) return false;
        subItems.children.filter(suSubItems => {
          if (suSubItems.title.toLowerCase().includes(term)) {
            suSubItems.icon = menuItems.icon;
            items.push(suSubItems);
          }
        });
      });
      this.checkSearchResultEmpty(items);
      this.menuItems = items;
    });
  }

  checkSearchResultEmpty(items) {
    if (!items.length) {
      this.searchResultEmpty = true;
    }
    else {
      this.searchResultEmpty = false;
    }
  }

  addFix() {
    this.searchResult = true;
    body.classList.add('offcanvas');
  }

  removeFix() {
    this.searchResult = false;
    body.classList.remove('offcanvas');
    this.text = ''
      ;
  }

  /**
   * Connect to the backend service and wait for SSEs
   */
   subscribeToNotifications() {
    this.notificationService.connectToServer().subscribe((notifications: Notification[]) => {
      this.unreadNotifications.unshift(...notifications);

      notifications.forEach(notification => {
        this.events.trigger('toast', {
          title: notification.user.name,
          msg: notification.message,
          type: 'info',
          onClick: () => this.performAction(notification)
        });
      });

    });
  }

  performAction(notification: Notification) {
    if (!notification.read_at) {
      this.notificationService.markRead(notification);
    }
  }

  markAllRead(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    
    this.notificationService.markAllRead().subscribe(() => this.unreadNotifications = []);
  }

  public fetchUnreadNotifications() {
    this.notificationService.getUnreadNotifications().subscribe(notifications => this.unreadNotifications = notifications);
  }

  ngOnInit() {
    this.navServices.organisationMenuItems.subscribe(menuItems => {
      this.items = menuItems;
    });

    this.fetchUnreadNotifications();

    // connect to backend for user notifications
    setTimeout(() => {
      this.subscribeToNotifications();
    }, 10000);

  }

}
