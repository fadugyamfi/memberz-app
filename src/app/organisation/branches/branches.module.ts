import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesRoutingModule } from './branches-routing.module';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchEditorComponent } from './branch-editor/branch-editor.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        BranchesRoutingModule,
        SharedModule,
        BranchListComponent,
        BranchEditorComponent
    ]
})
export class BranchesModule { }
