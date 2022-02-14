import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { OrganisationService } from '../services/api/organisation.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationPublicPageGuard implements CanActivate {

  constructor(
    public organisationService: OrganisationService,
    public router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.organisationService.getAllSlugs().pipe(map((slugs) => {
      let canActivate = slugs.includes(route.paramMap.get('org_slug'));

      if( !canActivate ) {
        this.router.navigate(['/auth/login']);
      }

      return canActivate;
    }));
  }

}
