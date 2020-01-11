import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

const maxAge = 30000;
@Injectable()
export class RequestCache  {

  cache = new Map();

  constructor() {
    this.runCleanUp();
  }

  runCleanUp() {
    setInterval(() => {
      const expired = Date.now() - maxAge;
      this.cache.forEach(expiredEntry => {
        if (expiredEntry.lastRead < expired) {
          this.cache.delete(expiredEntry.url);
        }
      });
    }, 15000);
  }

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) {
      return undefined;
    }

    if(cached && cached.method != req.method) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    return !isExpired ? cached.response : undefined;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;
    const entry = { url, response, method: req.method, lastRead: Date.now() };
    this.cache.set(url, entry);
  }
}