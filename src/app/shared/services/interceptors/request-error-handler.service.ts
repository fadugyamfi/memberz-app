import { Injectable } from '@angular/core';
import { EventsService } from '../events.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../cakeapi/auth.service';
import { StorageService } from '../storage.service';

@Injectable()
export class RequestErrorHandler {

  sessionErrorVisible = false;

  constructor(
    public events: EventsService,
    public storage: StorageService
  ) {}

  public handleError(err: HttpErrorResponse) {
    this.handleTokenExpiredError(err);
    this.triggerError(err);
  }

  handleTokenExpiredError(response: HttpErrorResponse) {
    if( response.error && (response.error.error == 'token_expired' || response.error.message == 'Unauthenticated.') ) {
      if( !this.sessionErrorVisible ) {
        this.sessionErrorVisible = true;

        if( this.storage.has('auth') ) {
          Swal.fire({
            title: "Session Expired",
            text: "Please login again to continue",
            type: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "Login Now"
          }).then(() => {
            this.sessionErrorVisible = false;
            this.events.trigger('api:authentication:required');
          });

          return true;
        }
      }
    }

    return false;
  }

  triggerError(error) {
    let message = error.error.message ? error.error.message : null;

    if( !message && error.message ) {
      message = error.message;
    }

    if( message && Array.isArray(message) ) {
      message = message.join('<br />');
    }

    else if( !message ) {
      message = "An unexpected error occurred";
    }

    this.events.trigger('toast', this.getError(message));
  }

  getError(msg: string) {
    return {
      title: 'Request Error',
      msg: msg,
      type: 'error',
      closeOther: true
    };
  }
}
