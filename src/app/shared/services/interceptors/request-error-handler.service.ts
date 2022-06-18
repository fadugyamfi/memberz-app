import { Injectable } from '@angular/core';
import { EventsService } from '../events.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { StorageService } from '../storage.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class RequestErrorHandler {

  sessionErrorVisible = false;

  constructor(
    public events: EventsService,
    public storage: StorageService,
    public translate: TranslateService
  ) {}

  public handleError(err: HttpErrorResponse) {
    this.handleTokenExpiredError(err);
    this.triggerError(err);
  }

  handleTokenExpiredError(response: HttpErrorResponse) {
    if ( response.error && (response.error.error === 'token_expired' || response.error.message === 'Unauthenticated.') ) {
      if ( this.sessionErrorVisible ) {
        return;
      }

      if ( !this.storage.has('auth') ) {
        this.events.trigger('api:authentication:clear');
        return true;
      }

      this.sessionErrorVisible = true;

      Swal.fire({
        title: this.translate.instant('Session Expired'),
        text: this.translate.instant('Please login again to continue'),
        icon: 'warning',
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: this.translate.instant('Login Now')
      }).then(() => {
        this.sessionErrorVisible = false;
        this.events.trigger('api:authentication:required');
      });
    }

    return false;
  }

  triggerError(error) {
    if ( this.sessionErrorVisible ) {
      return;
    }

    let message = error.error.message ? error.error.message : null;

    if ( !message && error.message ) {
      message = error.message;
    }

    if ( message && Array.isArray(message) ) {
      message = message.join('<br />');
    } else if ( !message ) {
      message = 'An unexpected error occurred';
    }

    this.events.trigger('toast', this.getError(message));
  }

  getError(msg: string) {
    return {
      title: 'Request Error',
      msg,
      type: 'error',
      closeOther: true
    };
  }
}
