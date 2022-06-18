import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { TawkChatModule } from '../components/tawk-chat/tawk-chat.module';
import { TranslateModule } from '@ngx-translate/core';

import { LoginComponent } from  './login/login.component';
import { RegisterComponent } from  './register/register.component';
import { ForgotPasswordComponent } from  './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from  './reset-password/reset-password.component';
import { TwoFaCheckComponent } from  './two-fa-check/two-fa-check.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TwoFaCheckComponent
  ],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    AuthRoutingModule,
    TawkChatModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class AuthModule {


}
