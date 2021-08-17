import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
