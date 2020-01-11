import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SmartTableModule } from 'ng2-smart-table';


import { BasicComponent } from './bootstrap-tables/basic/basic.component'
import { BorderComponent } from './bootstrap-tables/border/border.component'
import { SizingComponent } from './bootstrap-tables/sizing/sizing.component'
import { StylingComponent } from './bootstrap-tables/styling/styling.component'
import { BasicNgxDatatableComponent } from './ngx-datatables/basic/basic.component';
import { EditingComponent } from './ngx-datatables/editing/editing.component';
import { FilterNgxComponent } from './ngx-datatables/filter/filter.component';
import { FullscreenComponent } from './ngx-datatables/fullscreen/fullscreen.component';
import { PagingComponent } from './ngx-datatables/paging/paging.component';
import { SelectionNgxComponent } from './ngx-datatables/selection/selection.component';
import { SmartTableComponent } from './smart-table/smart-table.component';

@NgModule({
  declarations: [BasicComponent, BorderComponent, SizingComponent, StylingComponent, BasicNgxDatatableComponent, EditingComponent, FilterNgxComponent, FullscreenComponent, PagingComponent, SelectionNgxComponent, SmartTableComponent],
  imports: [
    CommonModule,
    TablesRoutingModule,
    NgxDatatableModule,
    Ng2SmartTableModule
  ]
})
export class TablesModule { }
