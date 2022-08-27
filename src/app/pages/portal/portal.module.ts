import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../../shared/shared.module';
// import { CreateOrganisationModule } from './create-organisation/create-organisation.module';
import { OrganisationEditorComponent } from './home/organisation-editor/organisation-editor.component';
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { UserDetailsEditComponent } from './user-profile-settings/user-details-edit/user-details-edit.component';
import { UserProfileComponent } from './user-profile-settings/user-profile.component';
import { TimezoneEditComponent } from './user-profile-settings/timezone-edit/timezone-edit.component';
import { DeleteAccountComponent } from './user-profile-settings/delete-account/delete-account.component';
import { TwofaEnableComponent } from './user-profile-settings/twofa-enable/twofa-enable.component';
import { MomentTimezonePickerModule } from 'moment-timezone-picker';
import { NotificationsComponent } from './notifications/notifications.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    HomeComponent,
    OrganisationEditorComponent,
    UserDetailsEditComponent,
    UserProfileComponent,
    TimezoneEditComponent,
    DeleteAccountComponent,
    TwofaEnableComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationComponent,
    NgxIntlTelInputModule,
    NgbModule,
    // CreateOrganisationModule,
    MomentTimezonePickerModule
  ]
})
export class PortalModule { }
