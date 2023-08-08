import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/api/auth.service';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class SecureInnerPagesGuard  {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.authService.isLoggedIn) {
            Swal.fire('Permission Required', 'You are not allowed to access this URL!', 'warning').then(() => {
                this.router.navigate(['/']);
            });
        }

        return true;
    }
}
