import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ReportsComponent } from './reports/reports.component';
import { MembershipsRoutingModule } from './memberships-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { GroupsComponent } from './group-manager/groups/groups.component';
import { GroupManagerComponent } from './group-manager/group-manager.component';
import { GroupTypesComponent } from './group-manager/group-types/group-types.component';
import { GroupLeadersComponent } from './group-manager/group-leaders/group-leaders.component';
import { UploadReviewComponent } from './bulk-upload/upload-review/upload-review.component';

import { GroupMembersComponent } from './group-manager/group-members/group-members.component';
import { AnniversariesComponent } from './anniversaries/anniversaries.component';
import { RegistrationFormsComponent } from './registration-forms/registration-forms.component';
import { RegistrationFormEditorComponent } from './registration-forms/registration-form-editor/registration-form-editor.component';
import { CustomFieldEditorComponent } from './registration-forms/custom-field-editor/custom-field-editor.component';




@NgModule({
  declarations: [
    CategoriesComponent,
    ProfilesComponent,
    BulkUploadComponent,
    ReportsComponent,
    ProfileEditorComponent,
    PendingApprovalsComponent,
    GroupsComponent,
    GroupManagerComponent,
    GroupTypesComponent,
    GroupLeadersComponent,
    UploadReviewComponent,
    GroupMembersComponent,
    AnniversariesComponent,
    RegistrationFormsComponent,
    RegistrationFormEditorComponent,
    CustomFieldEditorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MembershipsRoutingModule
  ]
})
export class MembershipsModule { }
