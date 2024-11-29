import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./branch-list/branch-list.component').then(m => m.BranchListComponent),
        data: {
          breadcrumb: 'Branches',
          title: "Branch List"
        }
      },
      {
        path: 'add',
        loadComponent: () => import('./branch-editor/branch-editor.component').then(m => m.BranchEditorComponent),
        data: {
          breadcrumb: 'Add Branch',
          title: "Add New Branch"
        }
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./branch-editor/branch-editor.component').then(m => m.BranchEditorComponent),
        data: {
          breadcrumb: 'Update Branch',
          title: "Update Branch"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchesRoutingModule { }
