import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintRoutingModule } from './print-routing.module';
import { MembershipsModule } from '../organisation/memberships/memberships.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrintRoutingModule,
    MembershipsModule,
  ]
})
export class PrintModule { }
