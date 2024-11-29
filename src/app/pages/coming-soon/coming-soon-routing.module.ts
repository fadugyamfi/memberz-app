import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'page',
        loadComponent: () => import('./simple/simple.component').then(m => m.SimpleComponent)
      },
      {
        path: 'page/image',
        loadComponent: () => import('./page-with-image/page-with-image.component').then(m => m.PageWithImageComponent)
      },
      {
        path: 'page/video',
        loadComponent: () => import('./page-with-video/page-with-video.component').then(m => m.PageWithVideoComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComingSoonRoutingModule { }
