import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        data: {
          title: "Your Organisations",
          breadcrumb: "Home"
        }
      },
      {
        path: 'profile',
        loadComponent: () => import('./user-profile-settings/user-profile.component').then(m => m.UserProfileComponent),
        data: {
          title: "Your Profile",
          breadcrumb: "User Settings"
        }
      },
      {
        path: 'notifications',
        loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent),
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
