import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PricingComponent } from './pricing/pricing.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      breadcrumb: 'Home',
      title: 'Welcome To Memberz.Org'
    }
  },
  {
    path: 'pricing',
    component: PricingComponent,
    data: {
      breadcrumb: 'Pricing',
      title: 'Pricing'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
