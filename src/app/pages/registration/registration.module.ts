import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { RegistrationRoutingModule } from './registration-routing.module';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';


@NgModule({
  declarations: [
    RegisterSuccessComponent,
    RegistrationFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RegistrationRoutingModule,
    NgxIntlTelInputModule,
  ]
})
export class RegistrationModule { }
