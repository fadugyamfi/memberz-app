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
import { GroupsComponent } from './groups/groups.component';
import { GroupManagerComponent } from './group-manager/group-manager.component';
import { GroupTypesComponent } from './group-types/group-types.component';
import { GroupLeadersComponent } from './group-leaders/group-leaders.component';
import { UploadReviewComponent } from './bulk-upload/upload-review/upload-review.component';
import { ProfileSummaryComponent } from './profile-view/profile-summary/profile-summary.component';
import { ProfileFamilyComponent } from './profile-view/profile-family/profile-family.component';
import { FamilyMemberEditorComponent } from './profile-view/profile-family/family-member-editor/family-member-editor.component';



@NgModule({
  declarations: [
    CategoriesComponent,
    ProfilesComponent,
    BulkUploadComponent,
    ReportsComponent,
    ProfileViewComponent,
    ProfileEditorComponent,
    PendingApprovalsComponent,
    MakeAdminComponent,
    GroupsComponent,
    GroupManagerComponent,
    GroupTypesComponent,
    GroupLeadersComponent,
    UploadReviewComponent,
    ProfileSummaryComponent,
    ProfileFamilyComponent,
    FamilyMemberEditorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MembershipsRoutingModule,
    NgbModule
  ]
})
export class MembershipsModule { }
