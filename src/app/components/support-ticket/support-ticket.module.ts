import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountToModule } from 'angular-count-to';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SupportTicketRoutingModule } from './support-ticket-routing.module';
import { SupportTicketComponent } from './support-ticket.component';

@NgModule({
  declarations: [SupportTicketComponent],
  imports: [
    CommonModule,
    SupportTicketRoutingModule,
    CountToModule,
    Ng2SmartTableModule
  ]
})
export class SupportTicketModule { }
