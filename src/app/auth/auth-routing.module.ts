import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TwoFaCheckComponent } from './two-fa-check/two-fa-check.component';

import { LoggedInGuard } from '../shared/guard/logged-in.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInGuard],
    data: {
      title: "Login"
    }
  },
  {
    path: '2fa',
    component: TwoFaCheckComponent,
    canActivate: [LoggedInGuard],
    data: {
      title: "Two Factor Auth"
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoggedInGuard],
    data: {
      title: "Register Account"
    }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [LoggedInGuard],
    data: {
      title: "Reset Your Password"
    }
  },
  {
    path: 'password-reset',
    component: ResetPasswordComponent,
    canActivate: [LoggedInGuard],
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
