import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchEditorComponent } from './branch-editor/branch-editor.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BranchListComponent,
        data: {
          breadcrumb: 'Branches',
          title: "Branch List"
        }
      },
      {
        path: 'add',
        component: BranchEditorComponent,
        data: {
          breadcrumb: 'Add Branch',
          title: "Add New Branch"
        }
      },
      {
        path: ':id/edit',
        component: BranchEditorComponent,
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
