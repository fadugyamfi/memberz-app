import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: ':slug',
    loadComponent: () => import('./registration-form/registration-form.component').then(m => m.RegistrationFormComponent),
    data: {
      breadcrumb: 'Registration Form'
    }
  },
  {
    path: ':slug/success/:membership_id',
    loadComponent: () => import('./register-success/register-success.component').then(m => m.RegisterSuccessComponent),
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
