import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { Notification } from '../../model/api/notification';
import { AuthService } from '../../services/api/auth.service';
import { MemberAccountService } from '../../services/api/member-account.service';
import { NotificationService } from '../../services/api/notification.service';
import { OrganisationAccountService } from '../../services/api/organisation-account.service';
import { OrganisationService } from '../../services/api/organisation.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-header-notifications',
  templateUrl: './header-notifications.component.html',
  styleUrls: ['./header-notifications.component.scss']
})
export class HeaderNotificationsComponent implements OnInit {

  public unreadNotifications = [];
  public canFetchUnreadNotifications = true;


  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    public events: EventsService,
    public notificationService: NotificationService,
    public router: Router,
    public organisationService: OrganisationService,
    public memberAccountService: MemberAccountService,
    public orgAccountService: OrganisationAccountService
  ) {}

  ngOnInit(): void {
    this.fetchUnreadNotifications();

    setInterval(() => this.fetchUnreadNotifications(), 60 * 1000);

    this.events.on('pause:fetching:unread:notifications', () => this.canFetchUnreadNotifications = false);
    this.events.on('start:fetching:unread:notifications', () => this.canFetchUnreadNotifications = true);
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

  fetchUnreadNotifications() {
    if( !this.authService.isLoggedIn || !this.canFetchUnreadNotifications ) {
      return;
    }

    this.notificationService.getUnreadNotifications().subscribe(notifications => this.unreadNotifications = notifications);
  }

  onNotificationClicked(notification: Notification) {
    this.notificationService.processNotification(notification);
  }
}
