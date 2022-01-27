import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilesComponent } from './profiles/profiles.component';
import { CategoriesComponent } from './categories/categories.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ReportsComponent } from './reports/reports.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { GroupManagerComponent } from './group-manager/group-manager.component';
import { ProfileViewComponent } from '../../shared/components/profile-view/profile-view.component';
import { AnniversariesComponent } from './anniversaries/anniversaries.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profiles',
        component: ProfilesComponent,
        data: {
          title: 'Membership Profiles',
          breadcrumb: 'Profiles'
        }
      },
      {
        path: 'view/:id',
        component: ProfileViewComponent,
        data: {
          title: 'Profile Details',
          breadcrumb: 'Profile Details'
        }
      },
      {
        path: 'view/:id',
        component: ProfileViewComponent,
        data: {
          title: 'Profile Details',
          breadcrumb: 'Profile Details',
          layout: 'flyout'
        },
        outlet: 'flyout'
      },
      {
        path: 'add',
        component: ProfileEditorComponent,
        data: {
          title: 'Add New Profile',
          breadcrumb: 'Add Profile',
          editMode: false
        }
      },
      {
        path: 'edit/:id',
        component: ProfileEditorComponent,
        data: {
          title: 'Edit Profile',
          breadcrumb: 'Edit Profile',
          editMode: true
        }
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        data: {
          title: 'Membership Categories',
          breadcrumb: 'Categories'
        }
      },
      {
        path: 'bulk-upload',
        component: BulkUploadComponent,
        data: {
          title: 'Bulk Upload',
          breadcrumb: 'Bulk Upload'
        }
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: {
          title: 'Membership Reports',
          breadcrumb: 'Reports'
        }
      },
      {
        path: 'pending-approvals',
        component: PendingApprovalsComponent,
        data: {
          title: 'Pending Approvals',
          breadcrumb: 'Pending Approvals'
        }
      },
      {
        path: 'groups',
        component: GroupManagerComponent,
        data: {
          title: 'Organisation Groups',
          breadcrumb: 'Groups'
        }
      },
      {
        path: 'anniversaries',
        component: AnniversariesComponent,
        data: {
          title: 'Membership Anniversaries',
          breadcrumb: 'Anniversaries'
        }
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipsRoutingModule { }
