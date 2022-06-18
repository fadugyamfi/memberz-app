import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { PageEvent } from '../../../shared/components/pagination/pagination.component';
import { Notification } from '../../../shared/model/api/notification';
import { AuthService } from '../../../shared/services/api/auth.service';
import { MemberAccountService } from '../../../shared/services/api/member-account.service';
import { NotificationService } from '../../../shared/services/api/notification.service';
import { OrganisationAccountService } from '../../../shared/services/api/organisation-account.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';
import { EventsService } from '../../../shared/services/events.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  public notifications = [];
  public fetching = false;

  constructor(
    public events: EventsService,
    public notificationService: NotificationService,
    public router: Router,
    public organisationService: OrganisationService,
    public authService: AuthService,
    public memberAccountService: MemberAccountService,
    public orgAccountService: OrganisationAccountService
  ) { }

  ngOnInit(): void {
    this.events.trigger('pause:fetching:unread:notifications');
    this.fetchNotifications();
  }

  ngOnDestroy(): void {
    this.events.trigger('start:fetching:unread:notifications');
  }

  /**
   * Connect to the backend service and wait for SSEs
   */
  subscribeToNotifications() {
    this.notificationService.connectToServer().subscribe((notifications: Notification[]) => {
      this.notifications.unshift(...notifications);

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

    this.notificationService.markAllRead().subscribe(() => {
      this.notifications.forEach(notification => notification.read_at = new Date())
    });
  }

  fetchNotifications(page = 1, limit = 20) {
    if (!this.authService.isLoggedIn) {
      return;
    }

    const user = this.authService.userData;
    this.fetching = true;

    this.notificationService.getNotifications({notifiable_id: user.id}, page, limit).subscribe({
      next: notifications => this.notifications = notifications,
      complete: () => this.fetching = false
    });
  }

  get unreadNotifications() {
    return this.notifications.filter(notification => notification.read_at == null);
  }

  onNotificationClicked(notification: Notification) {
    this.notificationService.processNotification(notification);
  }

  onPaginate(event: PageEvent) {
    this.fetchNotifications(event.page, event.limit);
  }
}
