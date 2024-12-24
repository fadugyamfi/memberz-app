import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule, AvatarSource } from 'ngx-avatars';
import { CustomFieldComponent } from '../../shared/components/forms/custom-field/custom-field.component';

const avatarSourcesOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS];
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        RegistrationRoutingModule,
        NgxIntlTelInputModule,
        AvatarModule.forRoot({
            sourcePriorityOrder: avatarSourcesOrder
        }),
        CustomFieldComponent,
        RegisterSuccessComponent,
        RegistrationFormComponent
    ]
})
export class RegistrationModule { }
