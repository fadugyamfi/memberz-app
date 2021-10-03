import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/api/auth.service';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class LoggedInGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        if (this.authService.isLoggedIn) {
            this.router.navigate(['/']);
        }

        return true;
    }
}
