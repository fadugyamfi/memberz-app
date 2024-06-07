import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/api/auth.service';
import Swal from 'sweetalert2';
import { OrganisationService } from '../services/api/organisation.service';

@Injectable({
    providedIn: 'root'
})
export class ActiveSubscriptionGuard  {
    constructor(
      private authService: AuthService,
      private router: Router,
      private organisationService: OrganisationService
    ) { }

    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

      const organisation = this.organisationService.getActiveOrganisation();
      const activeSubscription = organisation.active_subscription;

      if (activeSubscription.isExpired()) {
        this.router.navigate(['/organisation/settings/subscription']);
        return false;
      }

      return true;
    }
}
