import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { CreateOrganisationModule } from './create-organisation/create-organisation.module';
import { OrganisationEditorComponent } from './home/organisation-editor/organisation-editor.component';
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";



@NgModule({
  declarations: [
    HomeComponent,
    OrganisationEditorComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    NgxIntlTelInputModule,
    CreateOrganisationModule
  ]
})
export class PortalModule { }
