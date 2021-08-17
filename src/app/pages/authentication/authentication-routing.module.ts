import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginWithVideoComponent } from './login-with-video/login-with-video.component';
import { RegisterWithVideoComponent } from './register-with-video/register-with-video.component';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { AuthService } from '../../shared/services/firebase/auth.service';
import { SecureInnerPagesGuard } from '../../shared/guard/SecureInnerPagesGuard.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login/video',
        component: LoginWithVideoComponent
      },
      {
        path: 'register/video',
        component: RegisterWithVideoComponent
      },
      {
        path: 'unlockuser',
        component: UnlockUserComponent
      },
      {
        path: 'forgetpassword',
        component: ForgetPwdComponent
      },
      {
        path: 'resetpassword',
        component: ResetPwdComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthService, SecureInnerPagesGuard]
})
export class AuthenticationRoutingModule { }
