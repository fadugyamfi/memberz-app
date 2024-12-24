import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';







const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '400',
        loadComponent: () => import('./error400/error400.component').then(m => m.Error400Component),
      },
      {
        path: '401',
        loadComponent: () => import('./error401/error401.component').then(m => m.Error401Component)
      },
      {
        path: '403',
        loadComponent: () => import('./error403/error403.component').then(m => m.Error403Component)
      },
      {
        path: '404',
        loadComponent: () => import('./error404/error404.component').then(m => m.Error404Component)
      },
      {
        path: '500',
        loadComponent: () => import('./error500/error500.component').then(m => m.Error500Component)
      },
      {
        path: '503',
        loadComponent: () => import('./error503/error503.component').then(m => m.Error503Component)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorPagesRoutingModule { }
