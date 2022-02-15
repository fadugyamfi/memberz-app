import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { DataUsePolicyComponent } from './data-use-policy/data-use-policy.component';

const routes: Routes = [{
  path: 'terms',
  component: TermsAndConditionsComponent,
  data: {
    breadcrumb: 'Terms & Conditions'
  }
},{
  path: 'privacy-policy',
  component: DataUsePolicyComponent,
  data: {
    breadcrumb: 'Privacy Policy'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalTextRoutingModule { }
