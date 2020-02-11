import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { SlydepayConfig } from './slydepay.models';

@Injectable({
  providedIn: 'root'
})
export class SlydePayConfigInterceptor implements HttpInterceptor {
  constructor(@Inject('config') private config: SlydepayConfig) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      headers: req.headers.set('Content-Type', 'application/json'),
      body: {
        ...req.body,
        emailOrMobileNumber: this.config.emailOrMobileNumber,
        merchantKey: this.config.merchantKey
      }
    });
    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}
