import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserProfileComponent } from './user-profile-settings/user-profile.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: "Your Organisations",
          breadcrumb: "Home"
        }
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        data: {
          title: "Your Profile",
          breadcrumb: "User Settings"
        }
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: {
          title: "Notifications",
          breadcrumb: "Notifications"
        }
      },
      {
        path: 'create-organisation',
        loadChildren: () => import('./create-organisation/create-organisation.module').then(m => m.CreateOrganisationModule),
        data: {
          breadcrumb: 'Create Organisation'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
