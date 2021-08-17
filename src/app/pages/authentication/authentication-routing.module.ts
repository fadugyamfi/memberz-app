import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthService, SecureInnerPagesGuard]
})
export class AuthenticationRoutingModule { }
