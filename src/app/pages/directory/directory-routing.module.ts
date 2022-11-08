import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    data: {
      breadcrumb: 'Public Directory'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectoryRoutingModule { }
