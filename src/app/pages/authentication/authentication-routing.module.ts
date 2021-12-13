import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
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
  providers: [SecureInnerPagesGuard]
})
export class AuthenticationRoutingModule { }
