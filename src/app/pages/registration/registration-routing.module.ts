import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';

const routes: Routes = [
  {
    path: ':uuid',
    component: RegistrationFormComponent,
    data: {
      breadcrumb: 'Registration Form'
    }
  },
  {
    path: 's/:slug',
    component: RegistrationFormComponent,
    data: {
      breadcrumb: 'Registration Form By Slug'
    }
  },
  {
    path: ':uuid/success',
    component: RegisterSuccessComponent,
    data: {
      breadcrumb: 'Registration Success'
    }
  },
  {
    path: 's/:slug/success',
    component: RegisterSuccessComponent,
    data: {
      breadcrumb: 'Registration Success'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
