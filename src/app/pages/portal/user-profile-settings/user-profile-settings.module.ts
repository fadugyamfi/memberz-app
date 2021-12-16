import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { UserDetailsEditComponent } from './user-details-edit/user-details-edit.component';
import { TimezoneEditComponent } from './timezone-edit/timezone-edit.component';
import { TwofaEnableComponent } from './twofa-enable/twofa-enable.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';



@NgModule({
  declarations: [
    EditComponent,
    UserDetailsEditComponent,
    TimezoneEditComponent,
    TwofaEnableComponent,
    DeleteAccountComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserProfileSettingsModule { }
