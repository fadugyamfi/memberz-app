import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { full } from './shared/routes/full.routes';
import { UserLoggedInGuard } from './shared/guard/user-logged-in.guard';
import { OrganisationPublicPageGuard } from './shared/guard/organisation-public-page.guard';


import { OrganisationAdminGuard } from './shared/guard/organisation-admin.guard';

// import { SlydepayMockComponent } from 'slydepay-angular';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule),
      data: {
        title: 'Pages'
      }
    }]
  },
  {
    path: 'auth',
    children: [{
      path: '',
      loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      data: {
        title: 'Auth'
      }
    }]
  },
  // {
  //   path: 'slydepay-mock',
  //   component: SlydepayMockComponent,
  //   children: full
  // },
  {
    path: ':org_slug/register',
    loadComponent: () => import('./shared/components/layout/full-layout/full-layout.component').then(m => m.FullLayoutComponent),
    canActivate: [OrganisationPublicPageGuard],
    children: [{
      path: '',
      loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationModule),
      data: {
        breadcrumb: 'Membership Registration'
      }
    }]
  },
  {
    path: ':org_slug/directory',
    loadComponent: () => import('./shared/components/layout/full-layout/full-layout.component').then(m => m.FullLayoutComponent),
    canActivate: [OrganisationPublicPageGuard],
    children: [{
      path: '',
      loadChildren: () => import('./pages/directory/directory.module').then(m => m.DirectoryModule),
      data: {
        breadcrumb: 'Membership Directory'
      }
    }]
  },
  {
    path: 'legal',
    loadComponent: () => import('./shared/components/layout/full-layout/full-layout.component').then(m => m.FullLayoutComponent),
    children: [{
      path: '',
      loadChildren: () => import('./pages/legal-text/legal-text.module').then(m => m.LegalTextModule),
      data: {
        breadcrumb: 'Legal'
      }
    }]
  },
  {
    path: 'portal',
    loadComponent: () => import('./shared/components/layout/portal-layout/portal-layout.component').then(m => m.PortalLayoutComponent),
    canActivate: [UserLoggedInGuard],
    children: [{
      path: '',
      loadChildren: () => import('./pages/portal/portal.module').then(m => m.PortalModule),
      data: {
        breadcrumb: 'Portal'
      }
    }]
  },
  {
    path: 'organisation',
    loadComponent: () => import('./shared/components/layout/organisation-layout/organisation-layout.component').then(m => m.OrganisationLayoutComponent),
    canActivate: [OrganisationAdminGuard],
    children: [{
      path: '',
      loadChildren: () => import('./organisation/organisation.module').then(m => m.OrganisationModule),
      data: {
        breadcrumb: 'Organisation'
      }
    }]
  },
  {
    path: 'print',
    outlet: 'print',
    loadComponent: () => import('./shared/components/layout/print-layout/print-layout.component').then(m => m.PrintLayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./print/print.module').then(m => m.PrintModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
