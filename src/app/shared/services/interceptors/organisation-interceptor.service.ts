import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { RequestCache } from './request-cache.service';
import { of } from 'rxjs';
import { OrganisationService } from '../cakeapi/organisation.service';

@Injectable()
export class OrganisationInterceptor implements HttpInterceptor {

    constructor(private organisationService: OrganisationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const organisation = this.organisationService.getActiveOrganisation();
        if (organisation) {
            const cloneReq = req.clone({
                setParams: {
                    organisation_id: organisation.id
                }
             });
            return next.handle(cloneReq);
        }

        return next.handle(req);
    }

}
