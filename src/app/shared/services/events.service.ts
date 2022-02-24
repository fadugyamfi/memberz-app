import { Injectable } from '@angular/core';
import { Subject, from, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private listeners = {};
  private eventsSubject = new Subject();
  private events = from(this.eventsSubject);
  private sub: Subscription;

  constructor() {
    this.setupSubscription();
  }

  setupSubscription() {
    this.sub = this.events.subscribe(({ name, args }) => {
      if (this.listeners[name]) {
        for (const listener of this.listeners[name]) {
          listener(...args);
        }
      }
    });
  }

  on(name: string, listener: Function) {
    if (!this.sub) {
      this.setupSubscription();
    }

    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }

    this.listeners[name].push(listener);
  }

  off(name: string | string[]) {
    if( typeof name == 'string' ) {
      name = [name];
    }

    name.forEach(n => {
      if (this.listeners[n]) {
        this.listeners[n].pop();
      }
    });
  }

  trigger(name: string, ...args) {
    this.eventsSubject.next({ name, args });
  }

  /**
   * Clears the list of registered event listeners
   */
  destroy() {
    this.listeners = {};
  }
}
