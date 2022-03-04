import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';

import { RequestErrorHandler } from './request-error-handler.service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    public errorHandler: RequestErrorHandler,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((err, caught) => {
        if (err instanceof HttpErrorResponse) {
          this.errorHandler.handleError(err);
        }
        return throwError(() => new Error("Request Error"));
      })
    );
  }
}
