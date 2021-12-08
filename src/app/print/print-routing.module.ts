import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from '../pages/portal/create-organisation/profile/profile.component';

const routes: Routes = [
  {
    path: 'memberships',
    children: [
      {
        path: 'profiles',
        component: ProfileComponent,
        data: {
          title: 'Organisation Members Profiles',
          icon: 'icon-layout-sidebar-left',
          caption: 'Print out of organisation members profiles',
          status: true,
          printing: true
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule { }
