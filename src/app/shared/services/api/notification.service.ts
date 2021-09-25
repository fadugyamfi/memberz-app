import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import { Notification } from '../../model/api/notification';
import { StorageService } from '../storage.service';
import { Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends APIService<Notification> {

    constructor(http: HttpClient, protected events: EventsService, protected storage: StorageService) {
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

    getUnreadNotifications() {
        return this.get(`${this.url}/unread`).pipe(map(res => {
            return res['data'].map(data => new Notification(data));
        }));
    }

    markRead(notification: Notification) {
        return this.post(`${this.url}/${notification.id}/mark_read`, {});
    }

    markAllRead() {
        return this.post(`${this.url}/mark_all_read`, {});
    }
}
