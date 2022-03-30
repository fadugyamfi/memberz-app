import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { Notification } from '../../model/api/notification';
import { StorageService } from '../storage.service';
import { Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganisationService } from './organisation.service';
import { MemberAccountService } from './member-account.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { OrganisationAccountService } from './organisation-account.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends APIService<Notification> {

    constructor(
      http: HttpClient,
      protected events: EventsService,
      protected storage: StorageService,
      public organisationService: OrganisationService,
      public memberAccountService: MemberAccountService,
      public translate: TranslateService,
      public orgAccountService: OrganisationAccountService,
      public router: Router,
      public authService: AuthService
    ) {
        super(http, events, storage);

        this.url = '/notifications';
        this.model = Notification;
        this.model_name = 'Notification';
    }

    connectToServer(): Observable<Notification[]> {
        const user = this.storage.get('user');

        if (!user) {
            return;
        }

        const full_url = this.BASE_URL + `${this.url}/subscribe/${user.id}`;

        return this.observeMessages(full_url);
    }

    observeMessages(sseUrl: string, channels = ['message']): Observable<Notification[]> {
      const subject = new Subject<Notification[]>();
      const es = new EventSource(sseUrl, { withCredentials: true });

      channels.forEach((channel: string) => {
        es.addEventListener(channel, (evt) => {
            try {
                const data = JSON.parse(evt['data']);
                const items = data.map(item => new Notification(item));

                subject.next(items);
            } catch (e) {
                console.log(e);
            }
        });
      });

      return subject;
    }

    getUnreadNotifications(): Observable<Notification[]> {
      return this.get(`${this.url}/unread`).pipe(map(res => {
        return res['data'].map(data => new Notification(data));
      }));
    }

    getNotifications(options = {}, page = 1, limit = 20): Observable<Notification[]> {
      const params = { ...options, page, limit, sort: 'created_at:desc' };

      return this.get(`${this.url}`, params).pipe(map(res => {
          return res['data'].map(data => new Notification(data));
      }));
  }

    markRead(notification: Notification) {
      return this.post(`${this.url}/${notification.id}/mark_read`, {});
    }

    markAllRead() {
      return this.post(`${this.url}/mark_all_read`, {});
    }

    processNotification(notification: Notification) {
      const organisation = this.organisationService.getActiveOrganisation();
      const userOrgs = this.memberAccountService.getUserOrganisations();

      if( organisation && notification.organisation_id != organisation.id && userOrgs ) {
        const switchToOrganisation = userOrgs.find(org => org.id == notification.organisation_id);

        if( !switchToOrganisation ) {
          this.markRead(notification).subscribe();
          return;
        }

        const user = this.authService.userData;
        const headers = { 'X-Tenant-Id': switchToOrganisation.uuid };

        Swal.fire(
          this.translate.instant(`Switching To ${switchToOrganisation.name}`),
          this.translate.instant('Loading organisation information'),
          'info'
        );
        Swal.showLoading();

        this.orgAccountService.fetchAdminAccount(switchToOrganisation.id, user.id, {}, headers).subscribe({
          next: () => {
            Swal.close();
            this.organisationService.setActiveOrganisation( switchToOrganisation );
            this.markRead(notification).subscribe();
            this.router.navigate([notification.route]);
          },
          error: () => {
            Swal.fire(
              this.translate.instant('Could Not Switch To Organisation'),
              this.translate.instant('Please try again'),
              'error'
            )
          }
        })

        return;
      }

      this.markRead(notification).subscribe();
      this.router.navigate([notification.route]);
    }
}
