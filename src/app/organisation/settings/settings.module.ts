import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { AdminAccountsComponent } from './admin-accounts/admin-accounts.component';
import { SharedModule } from '../../shared/shared.module';
import { RolesComponent } from './roles/roles.component';


@NgModule({
  declarations: [
    AdminAccountsComponent,
    RolesComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
