import { Component, OnInit, Output, EventEmitter, OnDestroy, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/api/auth.service';
import { StorageService } from '../../services/storage.service';
import { EventsService } from '../../services/events.service';
import { NotificationService } from '../../services/api/notification.service';
import { Router, RouterLink } from '@angular/router';
import { OrganisationService } from '../../services/api/organisation.service';
import { OrganisationAccountService } from '../../services/api/organisation-account.service';
import { MemberAccountService } from '../../services/api/member-account.service';
import Swal from 'sweetalert2';
import { NgClass, NgIf, NgFor, UpperCasePipe, SlicePipe } from '@angular/common';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { FormsModule } from '@angular/forms';
import { ToggleFullscreenDirective } from '../../directives/fullscreen.directive';
import { HeaderNotificationsComponent } from './header-notifications.component';
import { AvatarModule } from 'ngx-avatars';

const body = document.getElementsByTagName('body')[0];

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [NgClass, FeatherIconsComponent, FormsModule, NgIf, NgFor, RouterLink, ToggleFullscreenDirective, HeaderNotificationsComponent, AvatarModule, UpperCasePipe, SlicePipe, TranslateModule]
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
  public currentLang = 'EN';

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(
    public navServices: NavService,
    private translate: TranslateService,
    public authService: AuthService,
    protected storage: StorageService,
    public events: EventsService,
    public notificationService: NotificationService,
    public router: Router,
    public organisationService: OrganisationService,
    public memberAccountService: MemberAccountService,
    public orgAccountService: OrganisationAccountService,
    private eRef: ElementRef, private renderer: Renderer2
  ) {
    translate.setDefaultLang('en');

    if (this.storage.has('current_lang')) {
      this.currentLang = this.storage.get('current_lang');
      translate.use(this.currentLang);
    }
  }

  ngOnInit() {
    this.navServices.organisationMenuItems.subscribe(menuItems => {
      this.items = menuItems;
    });


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
    this.currentLang = lang;
    this.translate.use(lang);
    this.storage.local().set('current_lang', lang, 1, 'week');
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

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      this.addFix()
      this.removeFix()
      this.searchResultEmpty = false;
    } else {
      this.removeFix()
      this.searchResultEmpty = false;

    }
  }

}
