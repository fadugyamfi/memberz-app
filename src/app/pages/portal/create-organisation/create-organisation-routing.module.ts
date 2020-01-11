import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateOrganisationComponent } from './create-organisation.component';


const routes: Routes = [
  {
    path: '',
    component: CreateOrganisationComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateOrganisationRoutingModule { }
