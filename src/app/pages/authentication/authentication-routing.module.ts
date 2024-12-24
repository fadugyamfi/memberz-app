import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecureInnerPagesGuard } from '../../shared/guard/SecureInnerPagesGuard.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'unlockuser',
        loadComponent: () => import('./unlock-user/unlock-user.component').then(m => m.UnlockUserComponent)
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
