import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [{
  path: 'terms',
  loadComponent: () => import('./terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent),
  data: {
    breadcrumb: 'Terms & Conditions'
  }
},{
  path: 'privacy-policy',
  loadComponent: () => import('./data-use-policy/data-use-policy.component').then(m => m.DataUsePolicyComponent),
  data: {
    breadcrumb: 'Privacy Policy'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalTextRoutingModule { }
