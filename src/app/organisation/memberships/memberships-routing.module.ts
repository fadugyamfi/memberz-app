import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';













const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profiles',
        loadComponent: () => import('./profiles/profiles.component').then(m => m.ProfilesComponent),
        data: {
          title: 'Membership Profiles',
          breadcrumb: 'Profiles'
        }
      },
      {
        path: 'view/:id',
        loadComponent: () => import('../../shared/components/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
        data: {
          title: 'Profile Details',
          breadcrumb: 'Profile Details'
        }
      },
      {
        path: 'view/:id',
        loadComponent: () => import('../../shared/components/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
        data: {
          title: 'Profile Details',
          breadcrumb: 'Profile Details',
          layout: 'flyout'
        },
        outlet: 'flyout'
      },
      {
        path: 'add',
        loadComponent: () => import('./profile-editor/profile-editor.component').then(m => m.ProfileEditorComponent),
        data: {
          title: 'Add New Profile',
          breadcrumb: 'Add Profile',
          editMode: false
        }
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./profile-editor/profile-editor.component').then(m => m.ProfileEditorComponent),
        data: {
          title: 'Edit Profile',
          breadcrumb: 'Edit Profile',
          editMode: true
        }
      },
      {
        path: 'categories',
        loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
        data: {
          title: 'Membership Categories',
          breadcrumb: 'Categories'
        }
      },
      {
        path: 'bulk-upload',
        loadComponent: () => import('./bulk-upload/bulk-upload.component').then(m => m.BulkUploadComponent),
        data: {
          title: 'Bulk Upload',
          breadcrumb: 'Bulk Upload'
        }
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent),
        data: {
          title: 'Membership Reports',
          breadcrumb: 'Reports'
        }
      },
      {
        path: 'pending-approvals',
        loadComponent: () => import('./pending-approvals/pending-approvals.component').then(m => m.PendingApprovalsComponent),
        data: {
          title: 'Pending Approvals',
          breadcrumb: 'Pending Approvals'
        }
      },
      {
        path: 'groups',
        loadComponent: () => import('./group-manager/group-manager.component').then(m => m.GroupManagerComponent),
        data: {
          title: 'Organisation Groups',
          breadcrumb: 'Groups'
        }
      },
      {
        path: 'anniversaries',
        loadComponent: () => import('./anniversaries/anniversaries.component').then(m => m.AnniversariesComponent),
        data: {
          title: 'Membership Anniversaries',
          breadcrumb: 'Anniversaries'
        }
      },
      {
        path: 'registration-forms',
        loadComponent: () => import('./registration-forms/registration-forms.component').then(m => m.RegistrationFormsComponent),
        data: {
          title: 'Registration Forms',
          breadcrumb: 'Registration Forms'
        }
      },
      {
        path: 'registration-forms/add',
        loadComponent: () => import('./registration-forms/registration-form-editor/registration-form-editor.component').then(m => m.RegistrationFormEditorComponent),
        data: {
          title: 'Add Registration Form',
          breadcrumb: 'Add Registration Form'
        }
      },
      {
        path: 'registration-forms/edit/:id',
        loadComponent: () => import('./registration-forms/registration-form-editor/registration-form-editor.component').then(m => m.RegistrationFormEditorComponent),
        data: {
          title: 'Edit Registration Form',
          breadcrumb: 'Edit Registration Form'
        }
      },
      {
        path: 'registration-forms/:id/pending-approvals',
        loadComponent: () => import('./pending-approvals/pending-approvals.component').then(m => m.PendingApprovalsComponent),
        data: {
          title: 'Pending Approvals',
          breadcrumb: 'Pending Approvals'
        }
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipsRoutingModule { }
