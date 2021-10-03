import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http';
import 'rxjs/add/observable/of';
import { OrganisationService } from '../api/organisation.service';

@Injectable()
export class OrganisationInterceptor implements HttpInterceptor {

    constructor(private organisationService: OrganisationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const organisation = this.organisationService.getActiveOrganisation();
        if (organisation) {
            const cloneReq = req.clone({
                setHeaders: {
                  'X-Tenant-Id': organisation.uuid
                }
             });
            return next.handle(cloneReq);
        }

        return next.handle(req);
    }

}
