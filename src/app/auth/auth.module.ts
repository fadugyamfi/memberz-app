import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

import { TranslateModule } from '@ngx-translate/core';

import { LoginComponent } from  './login/login.component';
import { RegisterComponent } from  './register/register.component';
import { ForgotPasswordComponent } from  './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from  './reset-password/reset-password.component';
import { TwoFaCheckComponent } from  './two-fa-check/two-fa-check.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
    CommonModule,
    NgxIntlTelInputModule,
    AuthRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TwoFaCheckComponent
]
})
export class AuthModule {


}
