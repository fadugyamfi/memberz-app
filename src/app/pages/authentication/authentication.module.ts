import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginWithVideoComponent } from './login-with-video/login-with-video.component';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    LoginWithVideoComponent,
    UnlockUserComponent,
    ResetPwdComponent,
    ForgetPwdComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule { }
