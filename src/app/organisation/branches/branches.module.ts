import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesRoutingModule } from './branches-routing.module';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchEditorComponent } from './branch-editor/branch-editor.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    BranchListComponent,
    BranchEditorComponent
  ],
  imports: [
    CommonModule,
    BranchesRoutingModule,
    SharedModule
  ]
})
export class BranchesModule { }
