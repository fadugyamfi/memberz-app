import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/api/auth.service';
import { OrganisationService } from '../services/api/organisation.service';

@Injectable({
  providedIn: 'root'
})
export class OrganisationAdminGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router,
    public organisationService: OrganisationService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Guard for organisation is selected and active
    const user = JSON.parse(localStorage.getItem('user'));
    const organisation = this.organisationService.getActiveOrganisation();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return true;
    }

    if (!organisation) {
      this.router.navigate(['/portal/home']);
      return true;
    }

    return true;
  }
}
