import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegisterSuccessComponent,
    RegistrationFormComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RegistrationRoutingModule,
    NgxIntlTelInputModule,
  ]
})
export class RegistrationModule { }
