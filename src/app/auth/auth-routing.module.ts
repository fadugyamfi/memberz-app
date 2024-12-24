import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';






import { UserNotLoggedInGuard } from '../shared/guard/user-not-logged-in.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [UserNotLoggedInGuard],
    data: {
      title: "Login"
    }
  },
  {
    path: '2fa',
    loadComponent: () => import('./two-fa-check/two-fa-check.component').then(m => m.TwoFaCheckComponent),
    canActivate: [UserNotLoggedInGuard],
    data: {
      title: "Two Factor Auth"
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    canActivate: [UserNotLoggedInGuard],
    data: {
      title: "Register Account"
    }
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [UserNotLoggedInGuard],
    data: {
      title: "Reset Your Password"
    }
  },
  {
    path: 'password-reset',
    loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    canActivate: [UserNotLoggedInGuard],
    data: {
      title: "Complete Password Reset"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
