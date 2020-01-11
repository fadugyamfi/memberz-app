import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ReportsComponent } from './reports/reports.component';
import { MembershipsRoutingModule } from './memberships-routing.module';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { MakeAdminComponent } from './make-admin/make-admin.component';



@NgModule({
  declarations: [
    CategoriesComponent, 
    ProfilesComponent, 
    BulkUploadComponent, 
    ReportsComponent, 
    ProfileViewComponent, ProfileEditorComponent, PendingApprovalsComponent, MakeAdminComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MembershipsRoutingModule,
    NgbModule
  ]
})
export class MembershipsModule { }
