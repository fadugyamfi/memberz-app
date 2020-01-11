import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAccountsComponent } from './admin-accounts/admin-accounts.component';
import { RolesComponent } from './roles/roles.component';


const routes: Routes = [
  {
    path: 'accounts',
    component: AdminAccountsComponent,
    data: {
      breadcrumb: 'Admin Accounts'
    }
  },
  {
    path: 'roles',
    component: RolesComponent,
    data: {
      breadcrumb: 'Roles & Permissions'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
