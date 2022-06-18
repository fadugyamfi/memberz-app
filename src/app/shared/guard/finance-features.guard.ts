import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/api/auth.service';
import Swal from 'sweetalert2';
import { OrganisationService } from '../services/api/organisation.service';

@Injectable({
    providedIn: 'root'
})
export class FinanceFeaturesGuard implements CanActivate {
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

      if (!activeSubscription.canAccessFinance()) {
        this.router.navigate(['/organisation/settings/pro-subscription-required']);
        return false;
      }

      return true;
    }
}
