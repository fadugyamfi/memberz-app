import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { RequestCache } from './request-cache.service';
import { of } from 'rxjs';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(private cache: RequestCache) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const cachedResponse = this.cache.get(req);
        return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache);
    }

    sendRequest(
        req: HttpRequest<any>,
        next: HttpHandler,
        cache: RequestCache): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                // cache only GET request results
                if (req.method == 'GET' && event instanceof HttpResponse) {
                    cache.put(req, event);
                }
            })
        );
    }
}