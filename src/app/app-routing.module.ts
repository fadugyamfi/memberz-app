import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ContentLayoutComponent } from './shared/components/layout/content-layout/content-layout.component';
import { FullLayoutComponent } from './shared/components/layout/full-layout/full-layout.component';
import { content } from './shared/routes/content-routes';
import { full } from './shared/routes/full.routes';
import { AdminGuard } from './shared/guard/admin.guard';
import { OrganisationPublicPageGuard } from './shared/guard/organisation-public-page.guard';
import { PortalLayoutComponent } from './shared/components/layout/portal-layout/portal-layout.component';
import { OrganisationLayoutComponent } from './shared/components/layout/organisation-layout/organisation-layout.component';
import { LoggedInGuard } from './shared/guard/logged-in.guard';
import { OrganisationAdminGuard } from './shared/guard/organisation-admin.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PrintLayoutComponent } from './shared/components/layout/print-layout/print-layout.component';
import { SlydepayMockComponent } from 'slydepay-angular';
import { TwoFaCheckComponent } from './auth/two-fa-check/two-fa-check.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portal/home',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'auth/2fa',
    component: TwoFaCheckComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'password-reset',
    component: ResetPasswordComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AdminGuard],
    children: content
  },
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [AdminGuard],
    children: full
  },
  {
    path: 'slydepay-mock',
    component: SlydepayMockComponent,
    children: full
  },
  {
    path: ':org_slug/register',
    component: FullLayoutComponent,
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
    path: 'portal',
    component: PortalLayoutComponent,
    canActivate: [AdminGuard],
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
    component: OrganisationLayoutComponent,
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
    component: PrintLayoutComponent,
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
